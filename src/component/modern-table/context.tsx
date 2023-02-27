/** 抽离provider产生的问题：在index中获取context时，最初取到的是createContext的默认值
 * 但像search这样关联属性的方法无法写到createContext中
 * 
 * 等想到好方法的时候再改改吧
*/

import React, { createContext, useState, useEffect, useRef } from "react";
import useDataList from './hooks/useDataList';
import useSelectedKeysMap from './hooks/useSelectedKeysMap';
import useExpandSelectedKeysMap from './hooks/useExpandSelectedKeysMap';
import lib from "@/lib";

const Context = createContext<any>({
    page: {
        current: 1,
        pageSize: 0,
        total: 0
    },
    param: {},
    dataList: []
});

type pageType = {
    current: number
    pageSize: number
    total: number
}

function ContextProvider({ children, url, method, defaultData, clearSelected }: any){
    const [ page, setPage ] = useState<pageType>({
        current: 1,
        pageSize: 0,
        total: 0
    })
    const [ param, setParam ] = useState<object>({})
    const [ dataList, setDataList ] = useState<object[]>([])

    const [ selectedKeysMap, addKeys, deleteKeys, clearKeys ] = useSelectedKeysMap()
    const [ expandSelectedKeysMap, setExpandKeys, clearExpandKeys ] = useExpandSelectedKeysMap()

    function search(page: pageType, param: object, clear: boolean){
        lib.request({
            url,
            method,
            needMask: true,
            data: {
                ...param,
                pageNum: page.current || 1,
                pageSize: page.pageSize || 5,
                ...defaultData
            },
            success: (data: any) => {
                setPage(data.page)
                setParam(param)
                setDataList(data.list)
                if(clear)
                    clearSelected()
            }
        })
    }

    return <Context.Provider value={{
        page,
        setPage,
        param,
        setParam,
        dataList,
        setDataList,

        search
    }}>
        {children}
    </Context.Provider>
}

const ContextConsumer = Context.Consumer

export { Context, ContextProvider, ContextConsumer }