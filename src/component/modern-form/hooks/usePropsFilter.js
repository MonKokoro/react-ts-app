/** 过滤props，突然感觉没啥必要，废弃 */

import { useState, useEffect } from 'react'

export default function useConfigRevise(json, base) {
    const [ props, setProps ] = useState()
    useEffect(() => {
        let result = {}
        for(let key in base){
            result[key] = json[key] || ''
        }
        setProps(result)
    }, [])
    return props
}