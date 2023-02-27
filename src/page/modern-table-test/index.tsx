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
        }
    ]

    const column = [
        {title: "乐队成员", dataIndex: "name"},
        {title: "年龄", dataIndex: "age"},
        {title: "声优", dataIndex: "cv"},
        {
            title: "操作",
            dataIndex: "operation",
            render: (_: any, record: any) => {
                return <Space>
                    <a>详情</a>
                </Space>
            }
        }
    ]

    const expandColumn = [
        {title: "演出时间", dataIndex: "date"},
        {title: "演出地点", dataIndex: "place"},
        {title: "演出名称", dataIndex: "name"},
    ]
    return <div className="modern-table-test">
        <ModernTable 
            actionRef={actionRef} 
            searchConfig={searchConfig}
            url={'/mock/getBondMemberList'} 
            column={column}
            topRender={
                <Space>
                    <Checkbox checked={expandable} onChange={(e) => setExpandable(e.target.checked)}>启用子表展开</Checkbox>
                </Space>
            }
            expand={expandable ? {
                key: "performanceExperience",
                column: () => expandColumn,
                rowSelect: false,
            } : false}
        />
    </div>
}

export default ModernTableTest;
