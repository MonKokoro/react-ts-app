import React, { useState, useRef } from 'react';
import { Checkbox, message, Space, Switch } from 'antd';
import ModernTable from '@/component/modern-table';
import type { ModernTableRef } from '@/component/modern-table';
import './index.less'

function ModernTableTest() {
    const actionRef = useRef<ModernTableRef>()
    const [ rowDisabled, setRowDisabled ] = useState<boolean>(false)
    const [ expandable, setExpandable ] = useState<boolean>(false)
    const [ expandSelectable, setExpandSelectable ] = useState<boolean>(false)
    const [ selectable, setSelectable ] = useState<boolean>(false)

    const searchConfig = [
        {
            type: "Input",
            label: "成员名称",
            name: "name",
            span: 3
        },
        {
            type: "Input",
            label: "成员名称",
            name: "name",
        },
        {
            type: "Input",
            label: "成员名称",
            name: "name",
        },
        {
            type: "Input",
            label: "成员名称",
            name: "name",
        }
    ]

    const columns = [
        {title: "乐队成员", dataIndex: "name", width: 200},
        {title: "年龄", dataIndex: "age", width: 200},
        {title: "声优", dataIndex: "cv", width: 200},
        {
            title: "操作",
            dataIndex: "operation",
            width: 200,
            render: (_: any, record: any) => {
                return <Space>
                    <a>详情</a>
                </Space>
            }
        }
    ]

    const expandColumns = [
        {title: "演出时间", dataIndex: "date"},
        {title: "演出地点", dataIndex: "place"},
        {title: "演出名称", dataIndex: "name"},
    ]
    return <div className="modern-table-test">
        <ModernTable 
            actionRef={actionRef} 
            searchConfig={searchConfig}
            url={'/mock/getBondMemberList'} 
            columns={columns}
            topRender={
                <Space>
                    <Checkbox checked={rowDisabled} onChange={(e) => setRowDisabled(e.target.checked)}>启用行禁用</Checkbox>
                    <Checkbox checked={selectable} onChange={(e) => setSelectable(e.target.checked)}>启用列表多选</Checkbox>
                    <Checkbox checked={expandable} onChange={(e) => {
                        setExpandable(e.target.checked)
                        if(!e.target.checked)
                            setExpandSelectable(false)
                    }}>启用子表展开</Checkbox>
                    {expandable && <Checkbox checked={expandSelectable} onChange={(e) => {
                        setExpandSelectable(e.target.checked)
                    }}>启用子表多选</Checkbox>}
                </Space>
            }
            leftButtonList={[
                { text: "获取已选中数据", onClick: () => {
                    console.log("selectedKeys", actionRef.current.getSelectedKeys())
                    console.log("selectedKeysMap", actionRef.current.getSelectedKeysMap())
                    console.log("expandSelectedKeys", actionRef.current.getExpandSelectedKeys())
                    console.log("expandSelectedKeysMap", actionRef.current.getExpandSelectedKeysMap())
                    console.log("expandSelectedRowsMap", actionRef.current.getExpandSelectedRowsMap())
                    message.success("已成功获取，请在控制台查看")
                } }
            ]}
            rowDisabled={(record: any) => {
                if(rowDisabled){
                    if(record.id === 2)
                        return true
                    return false
                }
                return false
            }}
            rowSelect={selectable ? {
                iconHidden: (record: any) => {
                    if(record.id === 3)
                        return true
                    return false
                }
            } : false}
            expand={expandable ? {
                key: "performanceExperience",
                columns: () => expandColumns,
                rowSelect: expandSelectable,
            } : false}
        />
    </div>
}

export default ModernTableTest;
