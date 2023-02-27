import React, { useState, useEffect, useMemo, ReactNode, useContext } from 'react';
import { Space, Button, Table, Pagination, Badge } from 'antd';
import lib from '../../lib';

import { TableContext } from "./index";

function TableContent({ 
    rowKey = "id",
    column = [], 
    scroll = {}, 
    topRender,
    leftButtonList,
    rowSelect,
    rowDisabled,
    expand,

    tableProps = {}
}: TableContentProps){
    const [ selectedRowKeys, setSelectedRowKeys ] = useState([]) //表格当页已选中列表，供给antd使用
    const { page, param, search, dataList } = useContext(TableContext)
    
    // const keysMap = useMemo(() => { return rowSelectFunction.selectedKeysMap }, [rowSelectFunction.selectedKeysMap])
    // const expandKeysMap = useMemo(() => {
    //     return expandSelectFunction.expandSelectedKeysMap
    // }, [expandSelectFunction.expandSelectedKeysMap])
    // const dataSource = useMemo(() => { 
    //     if(rowSelect){
    //         let keys = []
    //         dataList.map(item => {
    //             if(keysMap[item[rowKey]]){
    //                 keys.push(item[rowKey])
    //             }
    //         })
    //         setSelectedRowKeys(keys)
    //     }
    //     return dataList 
    // }, [dataList, keysMap])
    
    // const rowSelectionProps = useMemo(() => {
    //     let props = {}
    //     if(rowSelect){
    //         props.onChange = (keys) => {
    //             setSelectedRowKeys(keys)
    //         }
    //         props.onSelect = (record, selected) => {
    //             if(selected){
    //                 rowSelectFunction.addKeys([record], rowKey)
    //             }
    //             else{
    //                 rowSelectFunction.deleteKeys([record], rowKey)
    //             }
    //         }
    //         props.onSelectAll = (selected, selectedRows, changeRows) => {
    //             if(selected){
    //                 rowSelectFunction.addKeys(changeRows, rowKey)
    //             }
    //             else{
    //                 rowSelectFunction.deleteKeys(changeRows, rowKey)
    //             }
    //         }
    //         props.selectedRowKeys = selectedRowKeys
    //         props.getCheckboxProps = (record) => {
    //             let disabled = false
    //             if(rowSelect.iconHidden)
    //                 disabled = rowSelect.iconHidden(record)
    //             if(rowDisabled)
    //                 disabled = rowDisabled(record)
    //             return { disabled }
    //         }
    //         props.renderCell = (checked, record, index, originNode) => {
    //             let result = originNode
    //             if(rowSelect.iconHidden && rowSelect.iconHidden(record))
    //                 result = null
    //             if(rowDisabled && rowDisabled(record))
    //                 result = null
    //             else
    //                 return result
    //         }
    //         props.fixed = "left"
    //         props = { ...props, ...rowSelect.props }
    //     }
    //     return props
    // }, [ rowSelect, selectedRowKeys, keysMap ])

    const expandTableProps = useMemo(() => {
        let props: any = {}
        if(expand){
            props.expandedRowRender = (record: any) => {
                if(expand.render)
                    return expand.render(record)
                else if(record[expand.key] && record[expand.key].length){
                     /** expand.rowSelect为true时，子表可被选择 */
                    // const expandRowSelection = expand.rowSelect ? {
                    //     hideSelectAll: true,
                    //     onChange: (keys, rows) => {
                    //         expandSelectFunction.setExpandKeys(keys, rows, expand.rowKey || "id", record[rowKey])
                    //     },
                    //     selectedRowKeys: expandKeysMap[record[rowKey]] ?.keys || [],
                    // } : null
                    return <Table 
                        className='expanded-table' 
                        size='small' 
                        rowKey={expand.rowKey || "id"}
                        columns={expand.column(record)}
                        pagination={false}
                        dataSource={record[expand.key]}
                        // rowSelection={expandRowSelection}
                    />
                }
                else
                    return null
            }
            props.rowExpandable = (record) => {
                if(expand.render)
                    return expand.renderable ? expand.renderable(record) : true
                if(expand.key)
                    return record[expand.key] && record[expand.key].length ? true : false
                else
                    return false
            }
            props.fixed = "left"
        }
        return props
    }, [ expand ])

    // function onRow(record){
    //     if(rowDisabled && rowDisabled(record)){
    //         return { style: { color: "#CCCCCC" } }
    //     }
    // }

    /** 翻页 */
    function jumpTo(current: number, pageSize: number){
        let pageData = {
            current: page,
            pageSize: pageSize
        }
        search({current, pageSize}, param)
    }

    // function clearSelectKeys(){
    //     rowSelectFunction.clearKeys()
    //     setSelectedRowKeys([])
    // }
    
    return <div className='page-table-data'>
            { topRender && <div className='top-render'>{topRender}</div> }
            { leftButtonList && <Space>
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
                {/* {rowSelect && <Space className='top-selected'>
                    <Badge status="success" text={`已选择 ${Object.keys(keysMap).length} 条数据`} />
                    <a onClick={() => clearSelectKeys()}>清空</a>
                </Space>} */}
            </Space> }
            <div className="content-table">
                <Table
                    rowKey={rowKey}
                    className={`${(topRender || leftButtonList) ? "content-table-padding" : ""} common-content-table`}
                    columns={column}
                    pagination={false}
                    dataSource={dataList}
                    scroll={{y: 320, ...scroll}}
                    dataIndex={ rowKey || "key" }
                    // rowSelection={rowSelect ? rowSelectionProps : false}
                    expandable={expandTableProps}
                    // onRow={onRow}
                    {...tableProps}
                />
            </div>
            <div className="content-table-pagination">
                <Pagination 
                    current={page.current || 1} 
                    total={page.total || 0} 
                    pageSize={page.pageSize || 5}
                    showTotal={total => `共 ${total} 条`}
                    pageSizeOptions={["5", "10", "20", "50", "100"]}
                    showSizeChanger
					showQuickJumper
                    onChange={(page, pageSize) => jumpTo(page, pageSize)}
                    defaultCurrent={1}
                    defaultPageSize={5}
                />
            </div>
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

}

export type expandProps = {
    key?: string,
    column?: (record: any) => any[],
    rowKey?: string,
    rowSelect?: boolean,
    render?: ReactNode
}

export type TableContentProps = {
    rowKey?: string,
    column: any[],
    scroll?: {x?: number, y?: number},
    topRender?: ReactNode,
    leftButtonList?: leftButtonListProps[],
    rowSelect?: rowSelectProps | boolean,
    rowDisabled?: (record: any) => void,
    expand?: expandProps | false,
    tableProps?: any
}


export default TableContent