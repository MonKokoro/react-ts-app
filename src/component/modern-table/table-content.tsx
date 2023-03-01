import React, { useState, useEffect, useContext, ReactNode } from 'react';
import useDeepEffect from '@/hooks/useDeepEffect';
import { Space, Button, Table, Badge } from 'antd';
import lib from '../../lib';

import { TableContext } from "./index";

function TableContent({ 
    rowKey = "id",
    columns = [], 
    scroll = {}, 
    topRender,
    leftButtonList,
    rowSelect,
    rowDisabled,
    expand,
    paginationFixed,

    tableProps = {}
}: TableContentProps){
    const [ selectedRowKeys, setSelectedRowKeys ] = useState<any[]>([]) //表格当前页已选中的数据，供给antd使用
    const [ expandTableProps, setExpandTableProps ] = useState<any>() //表格展开配置
    const [ rowSelectionProps, setRowSelectionProps ] = useState<any>() //表格多选配置
    const {
        dataList,
        selectedCount,
        addKeys,
        deleteKeys,
        clearKeys,
        expandSelectedCount,
        expandSelectedKeysMap,
        setExpandKeys,
        clearExpandKeys
    } = useContext(TableContext)

    useDeepEffect(() => {
        if(expand){
            let props: any = {}
            props.expandedRowRender = (record: object) => {
                if(expand.render)
                    return expand.render(record)
                else if(record[expand.key] && record[expand.key].length){
                     /** expand.rowSelect为true时，子表可被选择 */
                    const expandRowSelection = expand.rowSelect ? {
                        hideSelectAll: true,
                        onChange: (keys: any[], rows: any[]) => {
                            setExpandKeys(record[rowKey], keys, rows)
                        },
                        selectedRowKeys: expandSelectedKeysMap[record[rowKey]] || [],
                    } : null
                    return <Table 
                        className='expanded-table' 
                        size='small' 
                        rowKey={expand.rowKey || "id"}
                        columns={expand.columns(record)}
                        pagination={false}
                        dataSource={record[expand.key]}
                        rowSelection={expandRowSelection}
                    />
                }
                else
                    return null
            }
            props.rowExpandable = (record: object) => {
                if(expand.render)
                    return expand.renderable ? expand.renderable(record) : true
                if(expand.key)
                    return record[expand.key] && record[expand.key].length ? true : false
                else
                    return false
            }
            props.fixed = "left"
            return setExpandTableProps(props)
        }
        return setExpandTableProps(undefined)
    }, [expand, expandSelectedCount])

    useDeepEffect(() => {
        if(rowSelect){
            let props: any = {}
            // 选中项发生变化时
            props.onChange = (keys: any[]) => {
                setSelectedRowKeys(keys)
            }
            // 用户手动选择/取消选择某行
            props.onSelect = (record: any, selected: boolean) => {
                if(selected)
                    addKeys([record])
                else
                    deleteKeys([record])
            }
            // 用户手动选择/取消选择所有行
            props.onSelectAll = (selected: boolean, _selectedRows: any[], changeRows: any[]) => {
                if(selected)
                    addKeys(changeRows)
                else
                    deleteKeys(changeRows)
            }
            // 指定选中项的key数组，全部由selectedRowKeys管理
            // props.selectedRowKeys = selectedRowKeys
            // 选择框的默认属性配置，当配置了iconHidden或存在禁用行rowDisabled属性时，改变配置
            props.getCheckboxProps = (record: any) => {
                if(rowSelect !== true && rowSelect.iconHidden(record))
                    return { disabled: true }
                if(rowDisabled && rowDisabled(record))
                    return { disabled: true }
                return { disabled: false }
            }
            // 渲染勾选框。经测试，即便设置不渲染，勾选全选时也会被选中，因此需要配合getCheckboxProps一起配置
            props.renderCell = (_checked: boolean, record: any, _index: number, originNode: any) => {
                if(rowSelect !== true && rowSelect.iconHidden(record))
                    return null
                if(rowDisabled && rowDisabled(record))
                    return null
                return originNode
            }
            // 固定在左侧
            props.fixed = "left"
            // rowSelection其它配置
            if(rowSelect !== true && rowSelect.props)
                props = { ...props, ...rowSelect.props }

            return setRowSelectionProps(props)
        }
        return setRowSelectionProps(undefined)
    // 经过测试：选中一项后必须通过监听selectedCount重新为rowSelectionProps赋值，才能使hooks中的计数器发生改变
    // 原因还是想不明白，组件中调用函数是无法触发钩子内状态的更新吗？
    }, [rowSelect, selectedCount])

    useDeepEffect(() => {
        // 列表数据发生变化时，一般代表翻页，此时需要比对一遍已选中的映射表
        if(rowSelect){
            const keys = dataList.reduce((prev: any[], curr: any) => {
                if(selectedRowKeys[curr[rowKey]]){
                    prev.push(curr[rowKey])
                }
            }, [])
            setSelectedRowKeys(keys)
        }
    }, [dataList])

    function onRow(record: any){
        if(rowDisabled && rowDisabled(record)){
            return { style: { color: "#CCCCCC" } }
        }
    }
    
    return <div className='page-table-data'>
        { (topRender && columns.length) ? <div className='top-render'>{topRender}</div> : '' }
        { (leftButtonList.length || rowSelect || (expand && expand.rowSelect)) && <div className='button-render'>
            <Space>
                {leftButtonList.map((item: leftButtonListProps, index: number) => {
                    if(!item.hidden){
                        let props = item.props || {}
                        return <Button 
                            {...props} 
                            type={item.type || 'primary'} 
                            onClick={() => item.onClick()} 
                            key={index}
                        >
                            {item.text}
                        </Button>
                    }
                })}
                {(rowSelect || (expand && expand.rowSelect)) && <>
                    <Badge status="success" text={`已选择 ${selectedCount + expandSelectedCount} 条数据`} />
                    <a onClick={() => {
                        clearKeys()
                        clearExpandKeys()
                        setSelectedRowKeys([])
                    }}>清空</a>
                </>}
            </Space>
        </div> }
        {columns.length ? <div className="content-table">
            <Table
                rowKey={rowKey}
                className={`${(topRender || leftButtonList) ? "content-table-padding" : ""} common-content-table`}
                columns={columns}
                pagination={false}
                dataSource={dataList}
                scroll={{y: 320, ...scroll}}
                dataIndex={ rowKey || "key" }
                rowSelection={rowSelectionProps ? {
                    ...rowSelectionProps,
                    selectedRowKeys
                }: false}
                expandable={expandTableProps}
                onRow={onRow}
                {...tableProps}
            />
        </div> : ''}
    </div>
}

export type leftButtonListProps = {
    text: string,
    onClick: () => void,
    hidden?: boolean,
    type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default"
    props?: any
}

export type rowSelectProps = {
    iconHidden?: (record: any) => boolean
    props?: any
}

export type expandProps = {
    key?: string,
    columns?: (record: any) => any[],
    rowKey?: string,
    rowSelect?: boolean,
    render?: (record: any) => ReactNode
    renderable?: (record: any) => boolean
}

export type TableContentProps = {
    rowKey?: string,
    columns: any[],
    scroll?: {x?: number, y?: number},
    topRender?: ReactNode,
    leftButtonList?: leftButtonListProps[],
    rowSelect?: rowSelectProps | boolean,
    rowDisabled?: (record: any) => boolean,
    expand?: expandProps | false,
    paginationFixed?: boolean,
    tableProps?: any
}


export default TableContent