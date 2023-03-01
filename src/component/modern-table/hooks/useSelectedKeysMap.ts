/** 设置表格已被选中的数据，本组件内通用 */
/** 考虑到使用数组会影响性能和代码的可读性，全部以映射表的形式保存 */

import { useState, useRef } from 'react'

export default function useSelectedKeysMap(key: string) {
    const selectedKeysMap = useRef<any>({})
    // 需要展示已选中的数量，因此并非无关渲染
    const [ selectedCount, setSelectedCount ] = useState<number>(0)
    
    // 由于table返回的是发生变化的list，因此直接做成批量操作比较好
    function addKeys( list: any[] = [] ){
        const newMap = list.reduce((prev, curr) => {
            prev[curr[key]] = curr
            return prev
        }, {})
        selectedKeysMap.current = {
            ...selectedKeysMap.current,
            ...newMap
        }
        setSelectedCount(selectedCount + list.length)
    }

    function deleteKeys( list: any[] = [] ){
        let selectedMap = {...selectedKeysMap.current}
        list.map(item => {
            delete selectedMap[item[key]]
        })
        selectedKeysMap.current = selectedMap
        setSelectedCount(selectedCount - list.length)
    }

    function clearKeys(){
        selectedKeysMap.current = {}
        setSelectedCount(0)
    }

    return {
        selectedKeysMap: selectedKeysMap.current, 
        selectedCount, 
        addKeys, 
        deleteKeys, 
        clearKeys
    }
}