/** 设置子表已被选中的数据，本组件内通用 */
/** 与主表多选不同，子表多选无需考虑分页，且无需展示选中数量 */
/** 注意：子表的选中与主表是否选中不相关，二者相互独立 */

import { useState, useRef } from 'react'

export default function useExpandSelectedKeysMap(expandKey?: string) {
    const [ expandSelectedKeysMap, setExpandSelectedKeysMap ] = useState<any>({})
    const [ expandSelectedCount, setExpandSelectedCount ] = useState<number>(0)
    const expandSelectedRowsMap = useRef<any>({})

    function setExpandKeys(
        mainKey?: string,
        keys: any[] = [],
        list: any[] = []
    ){
        const mainKeyCount = expandSelectedRowsMap.current[mainKey] ?.length || 0
        const newMap = list.reduce((prev, curr) => {
            prev[curr[expandKey]] = curr
            return prev
        }, {})
        expandSelectedRowsMap.current = {
            ...expandSelectedRowsMap.current,
            [mainKey]: newMap
        }
        setExpandSelectedCount( expandSelectedCount - mainKeyCount + keys.length )
        setExpandSelectedKeysMap({
            ...expandSelectedKeysMap,
            [mainKey]: keys
        })
    }

    function clearExpandKeys(){
        expandSelectedRowsMap.current = {}
        setExpandSelectedKeysMap({})
        setExpandSelectedCount(0)
    }

    return {
        expandSelectedCount,
        expandSelectedKeysMap,
        expandSelectedRowsMap: expandSelectedRowsMap.current,
        setExpandKeys,
        clearExpandKeys
    }
}