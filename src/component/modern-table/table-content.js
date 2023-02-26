import React, { useState, useEffect, useMemo } from 'react';
import { Space, Button, Table, Pagination, Badge } from 'antd';
import lib from '../../lib';

function TableSearch({ 
    rowKey = "id",
    column = [], 
    scroll = {}, 
    topRender,
    leftButtonList,
    rowSelect,
    rowSelectFunction = {selectedKeysMap, addKeys, deleteKeys, clearKeys},
    rowDisabled,
    expand,
    expandSelectFunction = {expandSelectedKeysMap, setExpandKeys, clearExpandKeys},
    page = {},
    dataList = [],
    search = function(){},

    tableProps = {}
}){
    const [ selectedRowKeys, setSelectedRowKeys ] = useState([]) //表格当页已选中列表，供给antd使用
    
    const pageInfo = useMemo(() => { return page }, [page])
    const keysMap = useMemo(() => { return rowSelectFunction.selectedKeysMap }, [rowSelectFunction.selectedKeysMap])
    const expandKeysMap = useMemo(() => {
        return expandSelectFunction.expandSelectedKeysMap
    }, [expandSelectFunction.expandSelectedKeysMap])
    const dataSource = useMemo(() => { 
        if(rowSelect){
            let keys = []
            dataList.map(item => {
                if(keysMap[item[rowKey]]){
                    keys.push(item[rowKey])
                }
            })
            setSelectedRowKeys(keys)
        }
        return dataList 
    }, [dataList, keysMap])
    
    const rowSelectionProps = useMemo(() => {
        let props = {}
        if(rowSelect){
            props.onChange = (keys) => {
                setSelectedRowKeys(keys)
            }
            props.onSelect = (record, selected) => {
                if(selected){
                    rowSelectFunction.addKeys([record], rowKey)
                }
                else{
                    rowSelectFunction.deleteKeys([record], rowKey)
                }
            }
            props.onSelectAll = (selected, selectedRows, changeRows) => {
                if(selected){
                    rowSelectFunction.addKeys(changeRows, rowKey)
                }
                else{
                    rowSelectFunction.deleteKeys(changeRows, rowKey)
                }
            }
            props.selectedRowKeys = selectedRowKeys
            props.getCheckboxProps = (record) => {
                let disabled = false
                if(rowSelect.iconHidden)
                    disabled = rowSelect.iconHidden(record)
                if(rowDisabled)
                    disabled = rowDisabled(record)
                return { disabled }
            }
            props.renderCell = (checked, record, index, originNode) => {
                let result = originNode
                if(rowSelect.iconHidden && rowSelect.iconHidden(record))
                    result = null
                if(rowDisabled && rowDisabled(record))
                    result = null
                else
                    return result
            }
            props.fixed = "left"
            props = { ...props, ...rowSelect.props }
        }
        return props
    }, [ rowSelect, selectedRowKeys, keysMap ])

    const expandTableProps = useMemo(() => {
        let props = {}
        if(expand){
            props.expandedRowRender = (record) => {
                if(expand.render)
                    return expand.render(record)
                else if(record[expand.key] && record[expand.key].length){
                     /** expand.rowSelect为true时，子表可被选择 */
                    const expandRowSelection = expand.rowSelect ? {
                        hideSelectAll: true,
                        onChange: (keys, rows) => {
                            expandSelectFunction.setExpandKeys(keys, rows, expand.rowKey || "id", record[rowKey])
                        },
                        selectedRowKeys: expandKeysMap[record[rowKey]] ?.keys || [],
                    } : null
                    return <Table 
                        className='expanded-table' 
                        size='small' 
                        rowKey={expand.rowKey || "id"}
                        columns={expand.column(record) || expand.column}
                        pagination={false}
                        dataSource={record[expand.key]}
                        rowSelection={expandRowSelection}
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
    }, [ expand, expandKeysMap ])

    function onRow(record){
        if(rowDisabled && rowDisabled(record)){
            return { style: { color: "#CCCCCC" } }
        }
    }

    /** 翻页 */
    function jumpTo(page, pageSize){
        let pageData = {
            current: page,
            pageSize: pageSize
        }
        search(pageData)
    }

    function clearSelectKeys(){
        rowSelectFunction.clearKeys()
        setSelectedRowKeys([])
    }
    
    return <div className='page-table-component'>
        <div className='page-table-data'>
            { topRender && <div className='top-render'>{topRender}</div> }
            { leftButtonList && <Space>
                {leftButtonList.map((item, index) => {
                    if(!item.hidden){
                        let props = item.props || {}
                        return <Button 
                            {...props} 
                            type={item.type || 'primary'} 
                            onClick={() => item.onClick(dataList)} 
                            key={index}
                        >
                            {item.text}
                        </Button>
                    }
                })}
                {rowSelect && <Space className='top-selected'>
                    <Badge status="success" text={`已选择 ${Object.keys(keysMap).length} 条数据`} />
                    <a onClick={() => clearSelectKeys()}>清空</a>
                </Space>}
            </Space> }
            <div className="content-table">
                <Table
                    rowKey={rowKey}
                    className={`${(topRender || leftButtonList) ? "content-table-padding" : ""} common-content-table`}
                    columns={column}
                    pagination={false}
                    dataSource={dataSource}
                    scroll={{y: 320, ...scroll}}
                    dataIndex={ rowKey || "key" }
                    rowSelection={rowSelect ? rowSelectionProps : false}
                    expandable={expandTableProps}
                    onRow={onRow}
                    {...tableProps}
                />
            </div>
            <div className="content-table-pagination" style={{ textAlign: 'right', paddingBottom: '20px', paddingTop: '10px' }}>
                <Pagination 
                    current={pageInfo.current || 1} 
                    total={pageInfo.total || 0} 
                    pageSize={pageInfo.pageSize || 5}
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
    </div>
}

export default TableSearch