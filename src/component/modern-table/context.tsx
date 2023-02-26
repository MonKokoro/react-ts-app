import React, { createContext, useState, useEffect } from "react";
import lib from "@/lib";

const Context = createContext(undefined);

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