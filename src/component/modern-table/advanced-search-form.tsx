/** 表格分页查询组件 - 上侧表单查询 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import { UpOutlined } from '@ant-design/icons'
import { CSSTransition } from "react-transition-group";
import useDeepEffect from "@/hooks/useDeepEffect"
import { Form, Space, Input, InputNumber, DatePicker, Select, Button }from 'antd';
import lib from '../../lib';

import { TableContext } from "./index";

// import AxiosSelect from "../axios-select"
// import FactorySelect from "../factory-select";
// import NumberRange from '../number-range';

const { Option } = Select
const { RangePicker } = DatePicker

function AdvancedSearchForm({
    searchConfig,
    cols = 3,
    clearSearch
}: AdvancedSearchFormProps){
    const formDivRef = useRef()
    const [ expand, setExpand ] = useState(true);                   //搜索栏是否展开，默认展开
    const [ formConfig, setFormConfig ] = useState([])
    const [ specialKeys, setSpecialKeys ] = useState({})
    const [ form ] = Form.useForm();

    const { page, search } = useContext(TableContext)

    useEffect(() => {
        if(clearSearch){
            form.resetFields()
        }
    }, [clearSearch])

    useDeepEffect(() => {
        let map = {}
        let result: any[] = []
        searchConfig.map((item: any) => {
            if(!item.hidden){
                switch(item.type){
                    case "DatePicker":
                        map[item.name] = "DatePicker"
                        break
                    case "RangePicker":
                        map[`${item.name[0]}_${item.name[1]}`] = "RangePicker"
                        item.name = `${item.name[0]}_${item.name[1]}`
                        break
                    case "FactorySelect":
                        map[item.name] = "FactorySelect"
                }
                result.push(item)
            }
        })
        setSpecialKeys(map)
        setFormConfig(result)
    }, [searchConfig])

    // const formConfig = useMemo(() => {
    //     let map = {}
    //     let result = []
    //     searchConfig.map(item => {
    //         if(!item.hidden){
    //             result.push(item)
    //             switch(item.type){
    //                 case "DatePicker":
    //                     map[item.name] = "DatePicker"
    //                 case "RangePicker":
    //                     map[item.name] = "RangePicker"
    //             }
    //         }
    //     })
    //     setSpecialKeys(map)
    //     return result
    // }, [])

    /** 搜索栏表单项渲染 */
    function searchItemRender(item: any){
        switch(item.type){
            case "Input":
                return <Input maxLength={item.maxLength || 255} />
            case "InputNumber": {
                let usedProps = {}
                //limit使用方法：[0, 1000000]
                if(item.limit){
                    usedProps["min"] = item["limit"][0]
                    usedProps["max"] = item["limit"][1]
                }
                return <InputNumber style={{width: "100%"}} {...usedProps} />
            }
            // case "Select":
            //     return <AxiosSelect 
            //         url={item.url} 
            //         defaultData={item.defaultData}
            //         selectList={item.selectList} 
            //         queryCode={item.queryCode}
            //         usedKey={item.usedKey}
            //         disabled={item.disabled}
            //         selectProps={item.props} 
            //     />
            // case "FactorySelect":
            //     return <FactorySelect 
            //         url={item.url}
            //         mode={item.mode || null}
            //         usedKey={item.usedKey}
            //         valueKey={item.valueKey}
            //         method={item.method}
            //         defaultData={item.defaultData}
            //     />
            case "DatePicker": 
                return <DatePicker style={{width: '100%'}}/>
            case "RangePicker":
                return <RangePicker style={{width: '100%'}} />
        }
    }

    /** 搜索栏渲染 */
    function getFields(){
        const count = expand ? formConfig.length : 2
        let children: any = []
        let showCount = 0
        
        formConfig.map((item, index) => {
            
            if(!item.hidden){
                // hidden与notShow不同：hidden表示在表单层级隐藏，不会提交；notShow表示视图上隐藏，有值时会提交
                const notShow = (!expand && children.length >= 1)
                const maxSpan = item.span ? (item.span > cols ? cols : item.span) : 1
                const itemStyle = {
                    flexBasis: `calc(${100/cols*maxSpan}% - 24px)`,
                    maxWidth: `calc(${100/cols*maxSpan}% - 24px)`
                }
                // children.push(<div className={`form-item`} style={itemStyle}>
                //     <Form.Item name={item.name} label={item.label}>
                //         {searchItemRender(item)}
                //     </Form.Item>
                // </div>
                // )
                children.push(<CSSTransition
                    key={index}
                    in={(expand || showCount == 0) ? false : true}
                    timeout={300}
                    classNames="item-fade"
                >
                    <div className={`form-item ${notShow ? "form-item-notshow" : ""}`} style={itemStyle}>
                        <Form.Item name={item.name} label={item.label}>
                            {searchItemRender(item)}
                        </Form.Item>
                    </div>
                </CSSTransition>
                )
                showCount++
                // children.push(<Col span={(index < count) ? 24/cols : 0} key={index}>
                //     <Form.Item name={item.name} label={item.label}>
                //         {searchItemRender(item)}
                //     </Form.Item>
                // </Col>)
            }
        })
    
        return children
    }

    function submit(){
        form.validateFields().then((values) => {
            let result = { ...values }
            for(let key in specialKeys){
                switch(specialKeys[key]){
                    case "DatePicker": {
                        if(result[key]){
                            result[key] = result[key].format('yyyy-MM-DD')
                        }
                        break
                    }
                    case "RangePicker": {
                        let usedKeys = key.split('_')
                        if(result[key]){
                            result[usedKeys[0]] = result[key] ? result[key][0] ?.format('yyyy-MM-DD') : ''
                            result[usedKeys[1]] = result[key] ? result[key][1] ?.format('yyyy-MM-DD') : ''
                            delete result[key]
                        }
                        break
                    }
                    case "FactorySelect": {
                        if(result[key]){
                            result[key] = result[key].id
                        }
                    }
                }
            }
            search({current: 1, pageSize: page.pageSize}, result, true)
        })
    }
    
    return (formConfig.length ? <Form
        form={form}
        name="advanced_search"
        // className="page-table-search-form"
    >
        <div className={`search-form ${!expand && "search-form-no-expand"}`} ref={formDivRef}>
            {getFields()}
            <div className="buttons">
                <Space>
                    {formConfig.length > (cols - 1) && <Button type='link' onClick={() => { setExpand(!expand) }}>
                        <UpOutlined className={`icon ${!expand && "icon-no-expand"}`}/> 
                        {expand ? "收起" : "展开"}
                    </Button>}
                    <Button type="primary" onClick={() => submit()}>查询</Button>
                    <Button onClick={() => { 
                        form.resetFields() 
                        search({})
                    }}>重置</Button>
                </Space>
            </div>
        </div>
        {/* <Row gutter={24}>
            {getFields()}
            <Col span={(!expand && formConfig.length > needExpandCount) ? 24 / cols : 24 / cols * buttonSpan} style={{ textAlign: 'right' }}>
                <Space>
                    <Button type="primary" onClick={() => submit()}>查询</Button>
                    <Button onClick={() => { 
                        form.resetFields() 
                        search({})
                    }}>重置</Button>
                </Space>
            </Col>
        </Row> */}
    </Form> : <></>)
}

export type searchConfigProps = {
    type: "Input" | "Select" | "DatePicker"
    label: string
    name: string
}

export type AdvancedSearchFormProps = {
    searchConfig: object[],
    cols?: number,
    clearSearch: number
}

export default AdvancedSearchForm