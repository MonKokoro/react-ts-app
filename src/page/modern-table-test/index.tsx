import React, { useState, useRef } from 'react';
import { Checkbox, Space, Switch } from 'antd';
import ModernTable from '@/component/modern-table';
import './index.less'

function ModernTableTest() {
    const actionRef = useRef()
    const [ expandable, setExpandable ] = useState<boolean>(false)

    const searchConfig = [
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
                    <Checkbox checked={expandable} onChange={(e) => setExpandable(e.target.checked)}>启用子表展开</Checkbox>
                </Space>
            }
            expand={expandable ? {
                key: "performanceExperience",
                columns: () => expandColumns,
                rowSelect: false,
            } : false}
        />
    </div>
}

export default ModernTableTest;
