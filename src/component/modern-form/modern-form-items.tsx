/**  公共表单组件 - 表单项组 */

import React, { useState, useContext } from "react";
import useDeepEffect from "@/hooks/useDeepEffect"

import { FormContext } from "./modern-form";
import ModernFormRender from "./modern-form-render";

import type { ModernFormItemsProps, FormItemType } from "./type";
 
function ModernFormItems({
    title, 
    tip,
    columns = 2, 
    config,
    rightRender,
    contentRender
}: ModernFormItemsProps){
    const [ usedConfig, setUsedConfig ] = useState([])
    const { setConvertFunc, setTransformFunc } = useContext(FormContext)

    // const convertPreset = (name: string | [string, string]) => {
    //     "SearchSelect": (record: any, paran: any) => {
    //         return record
    //     }
    // }

    useDeepEffect(() => {
        const newConfig = configRevise(config)
        setUsedConfig(newConfig)
    }, [ config ])

    /** 赋值转换预设 */
    function convertPreset(item: FormItemType){
        switch(item.type){
            case "SearchSelect": {
                return (_: any, param: any) => {
                    return {
                        id: param[item.name[0]],
                        name: param[item.name[1]],
                        record: "PLACEHOLDER"
                    }
                }
            }
            default: {
                return
            }
        }
    }

    /** 提交转换预设 */
    function transformPreset(item: FormItemType){
        switch(item.type){
            case "SearchSelect": {
                return (value: any) => {
                    console.log(item)
                    if(value && value.id)
                        return {
                            [item.name[0]]: value.id,
                            [item.name[1]]: value.name
                        }
                    else
                        return undefined
                }
            }
            default: {
                return
            }
        }
    }

    /** name字段转换 */
    function nameConvise(name: string | [string, string]){
        if(typeof(name) === 'string'){
            return name
        }
        else{
            return name.join('_')
        }
    }

    /** config格式化 */
    function configRevise(conf: FormItemType[]){
        let configByRow: any = []
        let row: any = []
        let convertMap = {}, transportMap = {}
        conf.map((item, index) => {
            // 如果该项需要被转换，写入格式转换映射中
            // 因为是一个一个写入的，或许会有性能的问题？
            if(!item.hidden){
                if(!item.convert && convertPreset(item)){
                    convertMap[nameConvise(item.name)] = convertPreset(item)
                }
                if(item.convert){
                    convertMap[nameConvise(item.name)] = item.convert
                }
                if(!item.transform && transformPreset(item)){
                    transportMap[nameConvise(item.name)] = transformPreset(item)
                }
                if(item.transform){
                    transportMap[nameConvise(item.name)] = item.transform
                }
                item.name = nameConvise(item.name)
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
        setConvertFunc(convertMap)
        setTransformFunc(transportMap)
        return configByRow
    }

    return <div className="modern-form-items">
        <div className="card-top">
            <div className="title">
                <div className="title-text">{title}</div>
                {tip && <div className="title-tip">
                    {tip}
                </div>}
                <div className="title-right">
                    {rightRender && rightRender}
                </div>
            </div>
        </div>
        <div className="card-context">
            {contentRender ? contentRender : <ModernFormRender config={usedConfig} columns={columns} />}
        </div>
    </div>
}
 
export default ModernFormItems