import React, { createContext, useState, useEffect } from "react";

const FormContext = createContext();

function FormContextProvider({ children }){
    const [ convertMap, setConvertMap ] = useState({})
    const [ transformMap, setTransformMap ] = useState({})

    function setConvertFunc(map){
        setConvertMap({
            ...convertMap,
            ...map
        })
    }

    function setTransformFunc(map){
        setTransformMap({
            ...transformMap,
            ...map
        })
    }

    return <FormContext.Provider value={{ convertMap, setConvertFunc, transformMap, setTransformFunc }}>
        {children}
    </FormContext.Provider>
}

const FormContextConsumer = FormContext.Consumer

export { FormContext, FormContextProvider, FormContextConsumer }