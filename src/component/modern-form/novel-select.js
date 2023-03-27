/** 联想下拉框组件 - 实现后台模糊查询的选择框组件 */

import React, { useState, useEffect, useRef } from "react";
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
function NovelSelect({ 
    url, 
    usedKey = ["value", "desc"],
    queryCode = "",
    method = "GET", 
    value, 
    defaultData = {},
    disabled = false,
    multiple = false,
    onChange = function(){},
    selectList,
    props = {}
}){
    const usedListMap = useRef()
    const [ usedList, setUsedList ] = useState([])
    const [ useValue, setUseValue ] = useState()

    useEffect(() => {
        setUseValue(value)
    }, [value])

    useDeepEffect(() => {
        getUsedList()
    }, [url, defaultData, queryCode])

    useDeepEffect(() => {
        setUsedList(selectList)
        if(selectList && selectList.length){
            usedListMap.current = selectList.reduce((prev, curr) => {
                prev[curr[usedKey[0]]] = curr
                return prev
            }, {})
        }
    }, [selectList])

    function getUsedList(){
        if(queryCode){
            lib.request({
                url: "/base/systemController/queryCode",
                data: { code: queryCode },
                method: "GET",
                success: (res) => {
                    let map = []
                    setUsedList(
                        res.reduce((prev, curr) => {
                            prev.push({ 
                                value: curr.valueStr, 
                                desc: curr.descStr
                            })
                            map[curr.valueStr] = curr
                            return prev
                        }, [])
                    )
                    usedListMap.current = map
                },
            })
        }
        else{
            if(url)
                lib.request({
                    url,
                    data: defaultData || {},
                    method,
                    success: (res) => {
                        setUsedList(res)
                        usedListMap.current = res.reduce((prev, curr) => {
                            prev[curr[usedKey[0]]] = curr
                            return prev
                        }, {})
                    },
                })
        }
    }

    /** 获取下拉框行数据 - 在Select组件中回传该选中行的所有数据 */
    function usedListRowsGet(value){
        return usedList.filter(it => {
            return value == (it[usedKey[0]])
        })[0]
    }

    return <Select 
        value={useValue}
        onChange={(value, option) => { 
            setUseValue(value)
            onChange(value, usedListMap.current[value])
        }}
        mode={multiple ? "multiple" : null}
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

export default NovelSelect