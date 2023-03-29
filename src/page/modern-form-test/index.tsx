import React, { useState, useRef, Suspense } from 'react';
import { Checkbox, message, Space, Alert, Button, Tag } from 'antd';
import ModernForm, { ModernFormItems, ModernFormList } from '@/component/modern-form';
import type { ModernFormRef, FormItemType } from '@/component/modern-form';
import './index.less'

function ModernFormTest() {
    const [ layout, setLayout ] = useState<"horizontal" | "vertical" | "inline">("vertical")
    const childRef = useRef<ModernFormRef>()

    function submit(){
        childRef.current.submit().then(values => {
            console.log(values)
        })
    }

    const baseConfig: FormItemType[] = [
        {
            type: "Input",
            label: "姓名",
            name: "name",
            required: true
        },
        {
            type: "Select",
            label: "性别",
            name: "sex",
            selectList: [
                { value: "boy", desc: "男生" },
                { value: "girl", desc: "女生" }
            ],
            required: true
        },
        {
            type: "InputNumber",
            label: "年龄",
            name: "age",
            limit: [1, 50],
            precision: 0,
            required: true
        },
        {
            type: "SearchSelect",
            label: "乐队所属",
            name: ["bondId", "bondName"],
            url: "/mock/getPlaceList",
            valueKey: "bondName",
            usedKey: ["value", "desc"]
        },
        {
            type: "NumberRange",
            label: "学习时间",
            name: "studyTime",
            limit: [0, 10],
            precision: 2
        },
        {
            type: "TextArea",
            label: "详细信息",
            name: "detail",
            span: 3
        }
    ]

    const listConfig = (field: any): FormItemType[] => {
        return [
            {
                type: "Input",
                label: "演出名称",
                name: "performanceName"
            },
            {
                type: "DatePicker",
                label: "演出时间",
                name: "performanceDate"
            }
        ]
    }

    return <div className="modern-form-test">
        <div className="modern-content">
            <ModernForm className='content-form' childRef={childRef} layout={layout}>
                <ModernFormItems 
                    title='基本信息' 
                    config={baseConfig} 
                    columns={3}
                    tip="基本信息~"
                    rightRender={
                        <Tag>右侧渲染</Tag>
                    }
                />
                <ModernFormList
                    title='演出信息' 
                    config={(field: any, _index: number) => {
                        return listConfig(field)
                    } }
                    name='performance'
                    childrenTitle={(field) => `演出信息${field.name + 1}`}
                    columns={3}
                    collapse={true}
                    minLength={1}
                />
            </ModernForm>
        </div>
        <div className='button-fixed'>
            <Button type='primary' onClick={() => submit()}>提交</Button>
        </div>
    </div>
}

export default ModernFormTest;
