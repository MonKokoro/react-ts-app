import React, { useState, useContext, ReactNode } from 'react';
import { SettingOutlined } from '@ant-design/icons'
import useDeepEffect from '@/hooks/useDeepEffect';
import { Space, Button, Table, Badge } from 'antd';

import { TableContext } from "./index";

import type { leftButtonListProps, rowSelectProps, expandProps } from './type'

function TableContent({ 
    rowKey = "id",
    columns = [], 
    scroll = {}, 
    leftButtonList,
    rowSelect,
    rowDisabled,
    expand,

    tableProps = {}
}: TableContentProps){
    const [ selectedRowKeys, setSelectedRowKeys ] = useState<any[]>([]) //表格当前页已选中的数据，供给antd使用
    const [ expandTableProps, setExpandTableProps ] = useState<any>() //表格展开配置
    const [ rowSelectionProps, setRowSelectionProps ] = useState<any>() //表格多选配置
    const {
        loading,
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
        <div className='top-buttons'>
            <Space className='left-buttons'>
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
            <Space className='right-buttons'>
                <SettingOutlined className='set-button' onClick={() => {}}/>
            </Space>
        </div>
        {columns.length ? <div className="content-table">
            <Table
                sticky={{ offsetHeader: -36 }} /** 减去内边距 */
                rowKey={rowKey}
                className={`common-content-table`}
                loading={loading}
                columns={columns}
                pagination={false}
                dataSource={dataList}
                // scroll={{y: 390, ...scroll}}
                scroll={scroll}
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

export type TableContentProps = {
    rowKey?: string,
    columns: any[],
    scroll?: {x?: number, y?: number},
    leftButtonList?: leftButtonListProps[],
    rowSelect?: rowSelectProps | boolean,
    rowDisabled?: (record: any) => boolean,
    expand?: expandProps | false,
    tableProps?: any
}


export default TableContent