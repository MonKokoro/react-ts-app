/** 设置表格数据 */

import { useState, useEffect } from 'react'

export default function useDataList(list = [], key = "id") {
    const [ dataList, setDataList ] = useState({
        list: [],
        map: {}
    })

    function setList(list = [], key = "id"){
        let axiosMap = {}
        list.map(item => {
            item.key = item[key]
            axiosMap[key] = item
        })
        setDataList({
            list,
            map: axiosMap
        })
    }

    useEffect(() => {
        setList(list, key)
    }, [])
    return [ dataList, setList ]
}