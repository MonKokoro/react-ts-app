/** 下拉框组件 - 可便捷获取接口数据的Select组件 */

import React, { useState, useEffect } from "react";
import useDeepEffect from "@/hooks/useDeepEffect"
import { Select } from "antd"
import lib from "../../lib";

const { Option } = Select

/**
 * 
 * @param url 下拉数据通过接口获取
 * @param usedKey 下拉列表id与name对应字段。默认["value", "desc"]
 * @param queryCode 当下拉数据通过字典获取，字典对应code值。设置后url、defaultData、method失效
 * @param method 下拉接口的请求方式，默认GET
 * @param value 选择框的选中值，目前仅支持novel表单中使用，暂不支持赋值
 * @param defaultData 需要额外传给后台的数据
 * @param disabled 是否可用
 * @param onChange 选择框的变更方法，目前仅支持novel表单中使用，暂不支持赋值
 * @param props 需要额外赋给antd Select组件的props值
 * @returns 
 */
function AxiosSelect({ 
    url, 
    usedKey = ["value", "desc"],
    queryCode = "",
    method = "GET", 
    value, 
    defaultData = {},
    disabled = false,
    onChange = function(){},
    selectList,
    props = {}
}: AxiosSelectProps){
    const [ usedList, setUsedList ] = useState([])
    const [ useValue, setUseValue ] = useState("")

    useEffect(() => {
        setUseValue(value)
    }, [value])

    useDeepEffect(() => {
        getSelectList()
    }, [url, defaultData, queryCode])

    useDeepEffect(() => {
        setUsedList(selectList)
    }, [selectList])

    function getSelectList(){
        if(queryCode){
            return lib.request({
                url: "/",
                data: { code: queryCode },
                method: "GET",
                success: (res: any) => {
                    setUsedList(res)
                    // setUsedList(
                    //     res.reduce((prev: any[], curr: { value: number | string, desc: number | string }) => {
                    //         prev.push({ 
                    //             value: curr.value, 
                    //             desc: curr.desc
                    //         })
                    //         return prev
                    //     }, [])
                    // )
                },
            })
        }
        if(url){
            return lib.request({
                url,
                data: defaultData || {},
                method,
                success: (res: any) => {
                    setUsedList(res)
                },
            })
        }
    }

    return <Select 
        value={useValue}
        onChange={(value, option) => { 
            setUseValue(value)
            onChange(value)
        }}
        filterOption={false}
        getPopupContainer={(triggerNode)=>{ return triggerNode.parentNode}}
        disabled={disabled}
        allowClear={true}
        optionFilterProp="children"
        showSearch={true}
        {...props}
    >
        {usedList && usedList.length && usedList.map((item, index) => {
            return <Option value={item[usedKey[0]]} key={index}>
                {item[usedKey[1]]}
            </Option>})
        }
    </Select>
}

type AxiosSelectProps = {
    url?: string,
    usedKey?: [ string, string ],
    queryCode?: string,
    method?: "GET" | "POST",
    value?: any,
    defaultData?: any,
    disabled?: boolean,
    onChange?: Function,
    selectList?: { value: number | string, desc: number | string }[],
    props?: any
}

export default AxiosSelect