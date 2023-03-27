/**  公共表单组件 - 表单项组 */

import React, { useState, useContext } from "react";
import useDeepEffect from "@/hooks/useDeepEffect"

import { FormContext } from "./novel-form";
import NovelFormRender from "./novel-form-render";
 
function ModernFormItems({
    title, 
    tip,
    columns = 2, 
    config,
    rightRender,
    contentRender
}){
    const [ usedConfig, setUsedConfig ] = useState([])
    const { setConvertFunc, setTransformFunc } = useContext(FormContext)

    useDeepEffect(() => {
        const newConfig = configRevise(config)
        setUsedConfig(newConfig)
    }, [ config ])

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
        setConvertFunc(convertMap)
        setTransformFunc(transportMap)
        return configByRow
    }

    return <div className="novel-form-items">
        <div className="card-top">
            <div className="title">
                <span className="title-text">{title}</span>
                {tip && <span className="title-tip">
                    {tip}
                </span>}
            </div>
            <div className="title-right">
                {rightRender && rightRender}
            </div>
        </div>
        <div className="card-context">
            {contentRender ? contentRender : <NovelFormRender config={usedConfig} columns={columns} />}
        </div>
    </div>
}
 
export default ModernFormItems