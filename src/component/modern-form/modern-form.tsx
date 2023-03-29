/**  全新公共表单组件 - 主框架 */

import React, { useImperativeHandle, createContext, useState, useContext, useRef } from "react";
import { useDeepEffect } from '@/hooks'
import { Form } from "antd";
import isPlainObject from 'lodash/isPlainObject'
import type { ModernFormRef, ModernFormProps } from './type'

const FormContext = createContext(null);

function ModernForm({
    childRef,
    className = '',
    layout,
    children,
    importData
}: ModernFormProps){
    const [form] = Form.useForm();
    const convertMap = useRef({})
    const transformMap = useRef({})
 
    /** 暴露给外部实例的多种方法 */
    useImperativeHandle(childRef, () => ({
        form: () => { return form },
        submit: () => {
            return new Promise((resolve, reject) => {
                form.validateFields().then((values) => {
                    resolve(transform(values))
                })
            })
        },
        getValues: (values) => { return form.getFieldsValue(values || true) },
        getValue: (value) => { return form.getFieldValue(value) },
        // 本赋值方法不适用格式化，注意哦
        setValue: (key, value) => { return form.setFieldValue(key, value) },
        setValues: (object) => { return form.setFieldsValue(object) },
        setValuesConvert: (object) => { return form.setFieldsValue(convert(object)) },
        clear: (keys) => {
            let clearValues = {}
            keys.map(key => { clearValues[key] = null })
            return form.setFieldsValue(clearValues)
        },
        reset: (keys) => {
            return form.resetFields(keys)
        },
    }))

    useDeepEffect(() => {
        if(importData){
            form.setFieldsValue(convert(importData))
            // console.log(convertMap)
        }
            
    }, [importData])

    function setConvertFunc(
        map: {[key: string]: (value: any, param: any) => any}, 
        listName?: string
    ){
        // 有listName代表是表单list，需要嵌套一层
        if(listName)
            convertMap.current = { ...convertMap.current, [listName]: map }
        else
            convertMap.current = { ...convertMap.current, ...map }
    }

    function setTransformFunc(
        map: {[key: string]: (value: any, param: any) => {[key: string]: any}}, 
        listName?: string
    ){
        // 有listName代表是表单list，需要嵌套一层
        if(listName)
            transformMap.current = { ...transformMap.current, [listName]: map }
        else
            transformMap.current = { ...transformMap.current, ...map }
    }

    // 获取字段转换
    function convert(param: {[key: string]: any}){
        const map = convertMap.current
        for(let key in map){
            // 通过typeof为方法还是对象，判断需要变更的对象是不是表单列表
            switch(typeof(map[key])){
                case "function": {
                    param[key] = map[key](param[key], param) || undefined
                    break;
                }
                case "object": {
                    let subParam = param[key]
                    let subMap = map[key]
                    if(subParam){
                        subParam = subParam.reduce((prev: any[], curr: any) => {
                            for(let subKey in subMap){
                                curr[subKey] = subMap[subKey](curr[subKey], curr) || undefined
                            }
                            prev.push(curr)
                            return prev
                        }, [])
                    }
                    param[key] = subParam
                    break
                }
            }
        }
        return param
    }

    // 提交字段转换
    function transform(param: {[key: string]: any}){
        const map = transformMap.current
        for(let key in map){
            switch(typeof(map[key])){
                case "function": {
                    const newPar = transformRevise(map[key](param[key], param), key)
                    param = { ...param, ...newPar }
                    break;
                }
                case "object": {
                    let subParam = param[key]
                    let subMap = map[key]
                    if(subParam){
                        subParam = subParam.reduce((prev: any[], curr: any, index: number) => {
                            for(let subKey in subMap){
                                const newPar = transformRevise(subMap[subKey](curr[subKey], curr, index, param), subKey)
                                curr = { ...curr, ...newPar }
                            }
                            prev.push(curr)
                            return prev
                        }, [])
                    }
                    param[key] = subParam
                    break
                }
            }
        }
        return param
    }

    // 提交字段转换 - return类型转换：如果返回的不是json对象，代表返回字段通过原字段传输
    // lodash的isPlainObject方法：可用来判断对象是不是json
    // 不过有些不太放心，后续可能会出问题？如果出问题可能需要改成手动验证
    function transformRevise(val: any, key: string | number){
        if(!isPlainObject(val)){
            return { [key]: val }
        }
        return val
    }

    return <div className={`novel-form ${className}`}>
        <FormContext.Provider 
            value={{
                convertMap: convertMap.current,
                setConvertFunc,
                transformMap: transformMap.current,
                setTransformFunc
            }}
        >
            <Form
                form={form}
                preserve={false}
                layout={layout || "vertical"}
                requiredMark={true}
                scrollToFirstError={true}
            >
                {children}
            </Form>
        </FormContext.Provider>
    </div>
}

export { FormContext }
export default ModernForm