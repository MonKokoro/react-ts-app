/** 设置表格已被选中的数据，本组件内通用 */
/** 考虑到使用数组会影响性能和代码的可读性，全部以映射表的形式保存 */

import { useState, useEffect } from 'react'

export default function useSelectedKeysMap(list = [], key = "id") {
    const [ selectedKeysMap, setSelectedKeysMap ] = useState({})
    
    function addKeys(list = [], key = "id"){
        let selectedMap = {...selectedKeysMap}
        list.map(item => {
            selectedMap[item[key]] = item
        })
        setSelectedKeysMap(selectedMap)
    }

    function deleteKeys(list = [], key = "id"){
        let selectedMap = {...selectedKeysMap}
        list.map(item => {
            delete selectedMap[item[key]]
        })
        setSelectedKeysMap(selectedMap)
    }

    function clearKeys(){
        setSelectedKeysMap({})
    }

    useEffect(() => {
        addKeys(list, key)
    }, [])

    return [ selectedKeysMap, addKeys, deleteKeys, clearKeys ]
}