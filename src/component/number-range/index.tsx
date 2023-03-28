/** 数值域组件 */

import React, { useState, useEffect, useMemo } from "react";
import { Input, InputNumber } from "antd"
import useDeepEffect from "@/hooks/useDeepEffect"

function NumberRange({ 
    value, 
    limit,
    disabled = false,
    onChange = function(){},
    props = {}
}: NumberRangeProps){
    const [ min, setMin ] = useState<string | number>()
    const [ max, setMax ] = useState<string | number>()

    useDeepEffect(() => {
        if(value){
            setMin(value[0])
            setMax(value[1])
        }
    }, [value])

    // useEffect(() => {
    //     onChange([min, max])
    // }, [min, max])

    let usedProps = {...props}
    if(limit){
        usedProps["min"] = limit[0]
        usedProps["max"] = limit[1]
    }
    return <div><Input.Group compact>
        <InputNumber 
            style={{width: "calc(50% - 15px)"}} 
            {...usedProps} 
            disabled={disabled}
            value={min}
            onChange={(val) => {
                if(max || max === 0 || val || val === 0)
                    onChange([val, max])
                else
                    onChange()
                setMin(val)
            }}
        />
        <Input
            className="site-input-split"
            style={{
                width: 30,
                borderLeft: 0,
                borderRight: 0,
                pointerEvents: 'none',
            }}
            placeholder="~"
            disabled
        />
        <InputNumber 
            style={{width: "calc(50% - 15px)"}} 
            {...usedProps} 
            disabled={disabled}
            value={max}
            onChange={(val) => {
                if(min || min === 0 || val || val === 0)
                    onChange([min, val])
                else
                    onChange()
                setMax(val)
            }}
        />
    </Input.Group></div>
}

export type NumberRangeProps = {
    value?: [string | number, string | number]
    limit?: [string | number, string | number]
    disabled?: boolean
    onChange?: (value?: [string | number, string | number]) => void
    props?: any
}

export default NumberRange