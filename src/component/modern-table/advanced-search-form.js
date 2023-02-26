/** 表格分页查询组件 - 上侧表单查询 */

import React, { useState, useEffect } from 'react';
import useDeepEffect from "@/hooks/useDeepEffect"
import { Row, Col, Form, Space, Input, InputNumber, DatePicker, Select, Button }from 'antd';
// import moment from 'moment';
import lib from '../../lib';

import AxiosSelect from "../axios-select"
import FactorySelect from "../factory-select";
import NumberRange from '../number-range';

const { Option } = Select
const { RangePicker } = DatePicker

function AdvancedSearchForm({ searchConfig, search, cols = 3, clearSearch }){
    const [ expand, setExpand ] = useState(true);                   //搜索栏是否展开，默认展开
    const [ formConfig, setFormConfig ] = useState([])
    const [ specialKeys, setSpecialKeys ] = useState({})
    const [ form ] = Form.useForm();

    useEffect(() => {
        if(clearSearch){
            form.resetFields()
        }
    }, [clearSearch])

    useDeepEffect(() => {
        let map = {}
        let result = []
        searchConfig.map(item => {
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
    function searchItemRender(item){
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
            case "Select":
                return <AxiosSelect 
                    url={item.url} 
                    defaultData={item.defaultData}
                    selectList={item.selectList} 
                    queryCode={item.queryCode}
                    usedKey={item.usedKey}
                    disabled={item.disabled}
                    selectProps={item.props} 
                />
            case "FactorySelect":
                return <FactorySelect 
                    url={item.url}
                    mode={item.mode || null}
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
        const count = expand ? formConfig.length : 2
        let children = []

        formConfig.map((item, index) => {
            if(item.type != "NumberRange"){
                children.push(<Col span={(index < count) ? 24/cols : 0} key={index}>
                    <Form.Item name={item.name} label={item.label}>
                        {searchItemRender(item)}
                    </Form.Item>
                </Col>)
            }
            else{
                let usedProps = {}
                //limit使用方法：[0, 1000000]
                if(item.limit){
                    usedProps["min"] = item["limit"][0]
                    usedProps["max"] = item["limit"][1]
                }
                children.push(<Col span={(index < count) ? 24/cols : 0} key={index}>
                    <Form.Item label={item.label}>
                        <Input.Group compact style={{width: "100%"}}>
                            <Form.Item name={item.name[0]} style={{width: "calc(50% - 15px)", marginBottom: 0}}>
                                <InputNumber style={{width: "100%"}} {...usedProps}/>
                            </Form.Item>
                            <Input
                                className="site-input-split"
                                style={{
                                    width: 30,
                                    borderLeft: 0,
                                    borderRight: 0,
                                    pointerEvents: 'none',
                                }}
                                placeholder="~"
                                readOnly
                            />
                            <Form.Item name={item.name[1]} style={{width: "calc(50% - 15px)", marginBottom: 0}}>
                                <InputNumber style={{width: "100%", borderLeft: "none"}} {...usedProps}/>
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                </Col>)
            }
        })
    
        return children
    }
    
    /** 表单提交事件 */
    function onFinish(values){
        search({ ...values })
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
            search(result)
        })
    }

    const buttonSpan = (formConfig.length % cols) ? (cols - formConfig.length % cols) : cols //按钮控件的占用列
    const needExpandCount = cols - 1 //需要展开的搜索项数量阈值
    
    return <Form
        form={form}
        name="advanced_search"
        className="page-table-search-form"
    >
        <Row gutter={24}>
            {getFields()}
            <Col span={(!expand && formConfig.length > needExpandCount) ? 24 / cols : 24 / cols * buttonSpan} style={{ textAlign: 'right' }}>
                <Space>
                    <Button type="primary" onClick={() => submit()}>查询</Button>
                    <Button onClick={() => { 
                        form.resetFields() 
                        search({})
                    }}>重置</Button>
                    {/* {formConfig.length > needExpandCount && <a style={{ fontSize: 12 }} onClick={() => { setExpand(!expand) }}>
                        {expand ? <UpOutlined /> : <DownOutlined />} {expand ? "收起" : "展开"}
                    </a>} */}
                </Space>
            </Col>
        </Row>
    </Form>
}

export default AdvancedSearchForm