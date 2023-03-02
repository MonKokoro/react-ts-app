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
    const [ expand, setExpand ] = useState<boolean>(false); //搜索栏是否展开，默认展开
    const [ formDivHeight, setFormDivHeight ] = useState<number>()
    const [ formConfig, setFormConfig ] = useState([]) //
    const [ specialKeys, setSpecialKeys ] = useState({})
    const [ form ] = Form.useForm();

    const { page, search } = useContext(TableContext)

    useEffect(() => {
        if(clearSearch){
            form.resetFields()
        }
    }, [clearSearch])

    useEffect(() => {
        // 由于transition动画效果对height为auto的目标没有效果，因此通过js获取目标的高度是必须的
        // 改变maxHeight确实也可以实现动画效果，但该效果并不完美
        // if(expand){
        //     if(formDivRef.current)
        //         setFormDivHeight(formDivRef.current["clientHeight"])
        // }
        // else{
        //     setFormDivHeight(80)
        // }
    }, [expand])

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
        let children: any = []
        let first = true
        let spanCount = 0
        formConfig.map((item, index) => {
            if(!item.hidden){
                let maxSpan = item.span || 1
                if(expand && item.span > cols){
                    maxSpan = cols
                }
                // 跨列的计数
                spanCount += maxSpan
                if(!expand && item.span > cols - 1){
                    maxSpan = cols - 1
                }
                const itemStyle = {
                    flexBasis: `calc(${100/cols*maxSpan}% - 24px)`,
                    maxWidth: `calc(${100/cols*maxSpan}% - 24px)`
                }
                children.push(<CSSTransition
                    key={index}
                    in={(expand && !first) ? false : true}
                    timeout={300}
                    classNames="item-fade"
                >
                    <div className={`form-item ${(!expand && !first) ? "form-item-not-show" : ""}`} style={itemStyle}>
                        <Form.Item name={item.name} label={item.label}>
                            {searchItemRender(item)}
                        </Form.Item>
                    </div>
                </CSSTransition>)
                first = false
            }
        })
        // 当跨列计数正好占满整数行时，额外塞一个空的item，让按钮组下移到下一行
        if(spanCount % cols == 0){
            const itemStyle = {
                flexBasis: `calc(${100/cols}% - 24px)`,
                maxWidth: `calc(${100/cols}% - 24px)`
            }
            children.push(<CSSTransition
                key={formConfig.length}
                in={expand ? false : true}
                timeout={300}
                classNames="item-fade"
            >
                <div className={`form-item ${!expand ? "form-item-not-show" : ""}`} style={itemStyle}>
                    
                </div>
            </CSSTransition>)
        }
    
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
    
    return <Form
        form={form}
        name="advanced_search"
    >
        <div className={`search-form ${!expand ? "search-form-no-expand" : ''}`} ref={formDivRef}>
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
    </Form>
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