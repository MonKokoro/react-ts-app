/** 表格分页查询组件 - 条件模块 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import { UpOutlined } from '@ant-design/icons'
import { CSSTransition } from "react-transition-group";
import dayjs from 'dayjs';
import useDeepEffect from "@/hooks/useDeepEffect"
import { Form, Space, Input, InputNumber, DatePicker, Button } from 'antd';
import type { searchConfigProps } from './type';
import lib from '../../lib';

import { TableContext } from "./index";

import AxiosSelect from "../axios-select"
import SearchSelect from "../search-select";
// import NumberRange from '../number-range';

const { RangePicker } = DatePicker

function AdvancedSearchForm({
    searchConfig,
    cols = 3,
    clearSearch
}: AdvancedSearchFormProps){
    // 与渲染无关的内容保存在ref中
    const convertMap = useRef()
    const transformMap = useRef()

    const [ expand, setExpand ] = useState<boolean>(false); //搜索栏是否展开，默认展开
    const [ formConfig, setFormConfig ] = useState([])

    const [ form ] = Form.useForm();
    const { page, search } = useContext(TableContext)

    useEffect(() => {
        if(clearSearch){
            form.resetFields()
        }
    }, [clearSearch])

    useDeepEffect(() => {
        let result: any[] = []
        let convert: any = {}, transform: any = {}
        searchConfig.map((item: any) => {
            if(!item.hidden){
                /** 部分表单项类型，将会预置一部分传值变更方法 */
                switch(item.type){
                    case "DatePicker":
                        convert[item.name] = (value: string) => {
                            return dayjs(value)
                        }
                        transform[item.name] = (value: any) => {
                            return { [item.name]: value.format("YYYY-MM-DD") }
                        }
                        break
                    case "RangePicker":
                        convert[item.name[0]] = (_: any, param: any) => {
                            return {
                                [item.name[0]]: dayjs(param[item.name[0]]),
                                [item.name[1]]: dayjs(param[item.name[1]])
                            }
                        }
                        transform[`${item.name[0]}_${item.name[1]}`] = (value: any) => {
                            // 推测：触发该方法时，item.name已经被修改，因此需要重新分隔一遍
                            const names = item.name.split('_')
                            return {
                                [names[0]]: value[0].format("YYYY-MM-DD"),
                                [names[1]]: value[1].format("YYYY-MM-DD")
                            }
                        }
                        item.name = `${item.name[0]}_${item.name[1]}`
                        break
                    // case "FactorySelect":
                    //     map[item.name] = "FactorySelect"
                }
                result.push(item)
            }
        })
        convertMap.current = convert
        transformMap.current = transform
        setFormConfig(result)
    }, [searchConfig])

    /** 搜索栏表单项渲染 */
    function searchItemRender(item: any){
        switch(item.type){
            case "Input":
                return <Input maxLength={item.maxLength || 255} />
            case "Select":
                return <AxiosSelect 
                    url={item.url} 
                    defaultData={item.defaultData}
                    selectList={item.selectList} 
                    queryCode={item.queryCode}
                    usedKey={item.usedKey}
                    disabled={item.disabled}
                    props={item.props} 
                />
            case "SearchSelect":
                return <SearchSelect 
                    url={item.url}
                    usedKey={item.usedKey}
                    valueKey={item.valueKey}
                    method={item.method}
                    defaultData={item.defaultData}
                />
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
        form.validateFields().then((values: any) => {
            let result = { ...values }
            const transform = transformMap.current || {}
            for(let key in transform){
                if(result[key]){
                    result = { ...result, ...transform[key](result[key]) }
                }
            }
            search({current: 1, pageSize: page.pageSize}, result, true)
        })
    }
    
    return <Form
        form={form}
        name="advanced_search"
    >
        <div className={`search-form ${!expand ? "search-form-no-expand" : ''}`}>
            {getFields()}
            <div className="buttons">
                <Space>
                    {formConfig.length > (cols - 1) && <Button type='link' onClick={() => { setExpand(!expand) }}>
                        <UpOutlined className={`icon ${!expand && "icon-no-expand"}`}/> 
                        {expand ? "收起" : "展开"}
                    </Button>}
                    <Button type="primary" onClick={() => submit()} >查询</Button>
                    <Button onClick={() => { 
                        form.resetFields() 
                        search({})
                    }}>重置</Button>
                </Space>
            </div>
        </div>
    </Form>
}

export type AdvancedSearchFormProps = {
    searchConfig: searchConfigProps[],
    cols?: number,
    clearSearch: number
}

export default AdvancedSearchForm