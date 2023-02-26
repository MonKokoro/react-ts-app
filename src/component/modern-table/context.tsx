import React, { createContext, useState, useEffect } from "react";

const Context = createContext(undefined);

type pageType = {
    current: number
    pageSize: number
    total: number
}

function ContextProvider({ children }: any){
    const [ page, setPage ] = useState<pageType>({
        current: 1,
        pageSize: 0,
        total: 0
    })
    const [ param, setParam ] = useState<object>({})
    const [ dataList, setDataList ] = useState<object[]>([])

    return <Context.Provider value={{
        param,
        setParam,
        dataList,
        setDataList
    }}>
        {children}
    </Context.Provider>
}

const ContextConsumer = Context.Consumer

export { Context, ContextProvider, ContextConsumer }