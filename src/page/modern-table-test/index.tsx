import React, { useState, useRef } from 'react';
import { Checkbox, message, Space, Alert, Tag } from 'antd';
import { useCompShow, usePage } from '@/hooks';
import ModernTable from '@/component/modern-table';
import type { searchConfigProps, ModernTableRef } from '@/component/modern-table';
import lib from '@/lib';
import './index.less'

import Detail from './detail';

function ModernTableTest() {
    const actionRef = useRef<ModernTableRef>()
    const detailDrawer = useCompShow()
    const page = usePage()
    const [ rowDisabled, setRowDisabled ] = useState<boolean>(false)
    const [ expandable, setExpandable ] = useState<boolean>(false)
    const [ expandSelectable, setExpandSelectable ] = useState<boolean>(false)
    const [ selectable, setSelectable ] = useState<boolean>(false)

    /** 批量删除 */
    function batchDelete(list: (number | string)[]){
        if(list.length){
            lib.confirmModal({
                content: `已选择${list.length}条数据，确定要删除吗？`,
                url: "/mock/commonTest",
                data: { ids: list.join(',') },
                success: () => {
                    actionRef.current.clearSelectedKeys()
                    actionRef.current.search()
                }
            })
        }
        else{
            message.warning("请至少选择一条数据")
        }
    }

    /** 关闭弹窗/抽屉 */
    function onClose(refreshFlag?: boolean) {
        detailDrawer.close()
        refreshFlag && actionRef.current.search()
    }

    const searchConfig: searchConfigProps[] = [
        {
            type: "Input",
            label: "成员名称",
            name: "name",
            span: 3
        },
        {
            type: "Select",
            label: "性别",
            name: "sex",
            selectList: [
                { value: 0, desc: "男生" },
                { value: 1, desc: "女生" }
            ]
        },
        {
            type: "DatePicker",
            label: "加入日期",
            name: "joinDate",
        },
        {
            type: "RangePicker",
            label: "生日",
            name: ["birthBegin", "birthEnd"]
        },
        {
            type: "SearchSelect",
            label: "成员所属",
            name: "place",
            url: "/mock/getPlaceList",
            valueKey: "placeValue"
        }
    ]

    const columns = [
        {title: "乐队成员", dataIndex: "name"},
        {title: "年龄", dataIndex: "age"},
        {title: "声优", dataIndex: "cv"},
        {
            title: "职责", 
            dataIndex: "responsibility", 
            render: (value: string) => {
                const tagMap = {
                    guitarist: <Tag color="gold">吉他手</Tag>,
                    drummer: <Tag color="volcano">鼓手</Tag>,
                    leadSinger: <Tag color="geekblue">主唱</Tag>,
                    bassist: <Tag color="cyan">贝斯手</Tag>
                }
                return tagMap[value]
            }
        },
        {
            title: "操作",
            dataIndex: "operation",
            width: 230,
            render: (_: any, record: any) => {
                return <Space>
                    <span className='link' onClick={() => detailDrawer.open({ id: record.memberId })}>详情</span>
                    <span className='link' onClick={() => page.openPage({
                        url: "/modern-table-test-detail",
                        // label: "详情测试",
                        param: { id: record.memberId }
                    })}>页面详情</span>
                    <span className='link-danger' onClick={() => batchDelete([record.id])}>删除</span>
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
        <Detail 
            show={detailDrawer.show}
            data={detailDrawer.param}
            onClose={(refreshFlag) => onClose(refreshFlag)}
        />
        <ModernTable 
            actionRef={actionRef} 
            searchConfig={searchConfig}
            url={'/mock/getBondMemberList'} 
            columns={columns}
            topRender={<>
                <Alert className='alert-message' type='info' message="数据由Mock随机生成" />
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
            </>}
            leftButtonList={[
                { text: "获取已选中数据", onClick: () => {
                    console.log("selectedKeys", actionRef.current.getSelectedKeys())
                    console.log("selectedKeysMap", actionRef.current.getSelectedKeysMap())
                    console.log("expandSelectedKeys", actionRef.current.getExpandSelectedKeys())
                    console.log("expandSelectedKeysMap", actionRef.current.getExpandSelectedKeysMap())
                    console.log("expandSelectedRowsMap", actionRef.current.getExpandSelectedRowsMap())
                    message.success("已成功获取，请在控制台查看")
                } },
                {
                    text: "批量删除",
                    props: { danger: true },
                    onClick: () => batchDelete(actionRef.current.getSelectedKeys())
                }
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
