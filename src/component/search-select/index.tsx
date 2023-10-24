/** 下拉搜索框 - 实现后台模糊查询的下拉框组件 */

import React, { useState, useEffect } from "react";
import { Select, Spin, Empty } from "antd"
import { useDeepEffect, useDebounce } from "@/hooks";
import lib from "../../lib";

const { Option } = Select

function SearchSelect({ 
    props = {}, 
    url, 
    valueKey,
    usedKey = ["value", "desc"],
    method = "GET", 
    value, 
    defaultData = {},
    allowInput,
    disabled = false,
    onChange = function(){},
    onClick = function(){}
}: SearchSelectProps){
    const [ selectList, setSelectList ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ useValue, setUseValue ] = useState("")
    const [ useDesc, setUseDesc ] = useState("")
    const [ defaultName, setDefaultName ] = useState("")
    const [ inputValue, setInputValue ] = useState("")

    const debounce = useDebounce((val: string) => getSelectList(val), 800)

    useEffect(() => {
        setUseValue(value ?.id || '')
        setUseDesc(value ?.name || '')
        setDefaultName(value ?.defaultName || "")
    }, [value])

    useEffect(() => {
        if(defaultName)
            getSelectList(defaultName)
    }, [defaultName])

    useDeepEffect(() => {
        setSelectList([])
    }, [defaultData])

    useEffect(() => {
        setSelectList([])
    }, [url])

    /** 获取下拉列表 */
    function getSelectList(value: string){
        lib.request({
            url,
            data: { [valueKey || "value"]: value, ...defaultData },
            method,
            success: (res: any) => {
                setLoading(false)
                setSelectList(res)
            },
            fail: () => {
                setLoading(false)
            }
        })
    }

    /** 输入框搜索方法 */
    function onSearch(value: string){
        setSelectList([])
        setInputValue(value)
        // 关于空值清空由前台做还是后台做？说实话咱也没定论
        setLoading(true)
        debounce(value)
    }

    /** 获取下拉框行数据 - 在Select组件中回传该选中行的所有数据 */
    function selectListRowsGet(value: any){
        return selectList.filter(it => {
            return value == (it[usedKey[0]])
        })[0]
    }

    return <Select 
        value={useValue}
        onChange={(newValue, option) => { 
            setUseValue(newValue)
            onChange({
                id: newValue,
                name: (option as any).children,
                record: newValue ? selectListRowsGet(newValue) : null
            }) 
            onClick(newValue, option, newValue ? selectListRowsGet(newValue) : null)
        }}
        filterOption={false}
        getPopupContainer={(triggerNode)=>{ return triggerNode.parentNode}}
        disabled={disabled}
        // 老东西，你的loading真没用😔
        // loading={loading}
        allowClear={true}
        onClear={() => {
            setSelectList([])
            setInputValue("")
        }}
        onSearch={(value) => onSearch(value)}
        optionFilterProp="children"
        notFoundContent={ loading ? <div style={{padding: '4px 12px 6px 12px'}}>
            <Spin size="small" />
        </div> : <Empty 
            style={{padding: '4px 12px 6px 12px'}}
            description={<span className="text-gray-500">
                {inputValue ? "未找到数据哦..." : "请输入尝试查询~"}
            </span>}
        /> }
        showSearch={true}
        {...props}
    >
        {allowInput && inputValue && <Option value={inputValue}>{inputValue}</Option>}
        {selectList ? selectList.map((item, index) => {
            return <Option value={item[usedKey[0]]} key={index}>
                {item[usedKey[1]]}
            </Option>
        }) : <Option value={useValue}>{useDesc}</Option>}
    </Select>
}

type SearchSelectProps = {
    url: string,
    valueKey: string,
    usedKey?: [ string, string ],
    method?: "GET" | "POST",
    value?: any,
    defaultData?: any,
    allowInput?: boolean,
    disabled?: boolean,
    onChange?: Function,
    onClick?: Function,
    props?: any
}

export default SearchSelect