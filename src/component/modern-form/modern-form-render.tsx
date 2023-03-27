/**  公共表单组件 - 表单项组 */

import React, { useState, useContext } from "react";
import useDeepEffect from "@/hooks/useDeepEffect"
import { Form, Row, Col, Input, InputNumber, Switch } from "antd";
import NovelSelect from "./novel-select";
// import FileUploader from "../file-uploader";
// import NumberRange from "../number-range"
import SearchSelect from "../search-select";
import { FormContext } from "./modern-form";
// import { FormContext } from "./form-context";

import type { ModernFormRenderProps } from './type'

const { Search, Password, TextArea } = Input;
 
function ModernFormRender({
    columns = 2, 
    config = [],
    field,
    listName
}: ModernFormRenderProps){
    const [ usedConfig, setUsedConfig ] = useState([])
    const { setConvertFunc, setTransformFunc } = useContext(FormContext)

    useDeepEffect(() => {
        // const newConfig = configRevise(config)
        // setUsedConfig(newConfig)
        setUsedConfig(config)
    }, [ config, field ])

    /** config格式化 */
    function configRevise(conf){
        let configByRow = [], row = []
        let convertMap = {}, transportMap = {}
        conf.map((item, index) => {
            // 如果该项需要被转换，写入格式转换映射中
            // 因为是一个一个写入的，或许会有性能的问题？
            if(!item.hidden){
                if(item.convert){
                    convertMap[item.name] = item.convert
                }
    
                if(item.transform){
                    transportMap[item.name] = item.transform
                }
            }
            
            // 变更为以行为单位
            if(item.enter || index === conf.length-1){
                row.push(item)
                configByRow.push(row)
                row = []
            }
            else{ 
                row.push(item)
            }
        })
        setConvertFunc(convertMap, listName)
        setTransformFunc(transportMap, listName)
        return configByRow
    }

    /** 表单组件渲染 */
    function itemRender(item){
        let usedItem = { ...item }
        switch(item.type){
            case "Input":
                return <Input 
                    maxLength={item.maxLength || 100} 
                    disabled={item.disabled} 
                    {...item.props} 
                />
            case "Span":
                return <Input className="form-item-span" readOnly bordered={false} />
            case "InputSearch":
                return <Search maxLength={item.maxLength || 100} {...item.props} />
            case "InputPassword":
                return <Password maxLength={item.maxLength || 100} {...item.props}/>
            case "InputNumber": 
                const usedProps = {}
                //limit使用方法：[0, 1000000]
                if(item.limit){
                    usedProps["min"] = item["limit"][0]
                    usedProps["max"] = item["limit"][1]
                }
                if(item.precision){
                    usedProps["precision"] = item["precision"]
                }
                return <InputNumber style={{width: "100%"}} {...usedProps} />
            case "NumberRange": {
                const usedProps = {}
                if(item.limit){
                    usedProps["limit"] = item["limit"]
                }
                return <NumberRange {...usedProps} />
            }
                
            case "TextArea":
                return <TextArea 
                    showCount 
                    maxLength={item.maxLength || 100} 
                    style={{ height: item.height || 120 }} 
                    {...item.props} 
                />
            case "Select":
                return <NovelSelect 
                    url={item.url} 
                    defaultData={item.defaultData}
                    selectList={item.selectList} 
                    multiple={item.multiple}
                    queryCode={item.queryCode}
                    usedKey={item.usedKey}
                    disabled={item.disabled}
                    selectProps={item.props} 
                    onChange={item.onChange}
                />
            case "FactorySelect":
                return <FactorySelect
                    url={item.url}
                    disabled={item.disabled}
                    method={item.method}
                    usedKey={item.usedKey}
                    valueKey={item.valueKey}
                    defaultData={item.defaultData}
                    props={item.props}
                    onClick={item.onChange}
                />
            case "Switch":
                return <Switch
                    disabled={item.disabled}
                    onChange={(checked, field) => item.onChange && item.onChange(checked, field)}
                    {...item.props}
                />
            case "Upload":
                return <FileUploader 
                    maxCount={item.maxCount}
                    fileSize={item.fileSize}
                    disabled={item.disabled}
                    fileType={item.fileType}
                    defaultData={item.defaultData}
                    uploadSuccess={(res) => item.uploadSuccess && item.uploadSuccess(res)}
                    fileKey={item.fileKey || "uploadFile"}
                    url={item.url}
                />
            case "Custom":
                return item.render()
        }
    }

    return <div className="novel-form-context">
        {usedConfig && usedConfig.map((rowItem, rowIndex) => {
            return <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} key={rowIndex}>
                {rowItem.map((item, index) => {
                    // 出于必填判定比其它rules判定使用更频繁的考虑，单独将其抽到rules配置中
                    // 针对不同的表单项，使用更严谨的必填提示文本
                    const specialTypeMsgMap = {
                        "Select": "选择",
                        "FactorySelect": "选择",
                        "Upload": "上传",
                        "ImgUpload": "上传"
                    }
                    let rules = []
                    item["required"] && rules.push({
                        required: true,
                        message: `请${specialTypeMsgMap[item.type] || "输入"}${item.label}`
                    })

                    // 针对文本框，内置一些常用的正则验证方法。如果其它rules验证规则的话，允许自定义。
                    if(item["rulesReg"]){
                        const regMap = {
                            "eMail": /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/,
                            "cellPhone": /^1[3|4|5|7|8|9]\d{9}$/
                        }
                        rules.push({
                            pattern: regMap[item.rulesReg],
                            message: `请输入正确格式的${item.name}`
                        })
                    }
                    // 针对数值域，考虑到表单提交的时候大小值异常还是容易出问题，内置大小值的验证规则
                    if(item["type"] == "NumberRange"){
                        rules.push(
                            () => ({
                                validator(_, value) {
                                    if(value){
                                        if(item.require && (!value[0] || !value[1])){
                                            return Promise.reject(new Error('请输入正确的数值区间'));
                                        }
                                        if (!value[0] || !value[1] || value[0] > value[1]) {
                                            return Promise.reject(new Error('请输入正确的数值区间'));
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        )
                    }
                    if(item["rules"])
                        rules = rules.concat(item.rules)
 
                    // 部分组件的默认value值并不能用于表单提交，因此需要调整valuePropName使用参数
                    let extraProps = {}
                    switch(item.type){
                        case "Switch":
                            extraProps["valuePropName"] = "checked";
                            break;
                    }

                    if(item["requiredMask"]){
                        extraProps["required"] = true
                    }
             
                    //渲染
                    if(item.hidden || (item.hiddenField && item.hiddenField(field)))
                        return ""
                    else
                        return <Col span={ 24/columns*(item.span || 1) } key={`${rowIndex}-${index}`}>
                            {field ? <Form.Item
                                {...field}
                                label={item.label}
                                name={[field.name, item.name]}
                                fieldKey={[field.fieldKey, item.name]}
                                rules={rules}
                                tooltip={item.tooltip || null}
                                {...extraProps}
                                key={`${field.key}-${item.name}`}
                                noStyle={item.noStyle}
                            >
                                {itemRender(item)}
                            </Form.Item>
                            :
                            <Form.Item
                                label={item.label}
                                name={item.name}
                                rules={rules}
                                tooltip={item.tooltip || null}
                                {...extraProps}
                                key={index}
                                noStyle={item.noStyle}
                                shouldUpdate={item.shouldUpdate || false}
                            >
                                {itemRender(item)}
                            </Form.Item>
                        }
                        </Col>
                })}
            </Row>
        })}
    </div>
}
 
export default ModernFormRender