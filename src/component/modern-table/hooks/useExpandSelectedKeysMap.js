/** 设置子表已被选中的数据，本组件内通用 */
/** 因为子表不会受到分页的影响，因此可以很方便的通过映射表同时保存list和map两种形式，以备不时之需 */

import { useState, useEffect } from 'react'

export default function useExpandSelectedKeysMap(keys = [], list = [], key = "id", mainKey) {
    const [ expandSelectedKeysMap, setExpandSelectedKeysMap ] = useState({})

    function setExpandKeys(keys = [], list = [], key = "id", mainKey){
        let _expandSelectedKeysMap = {...expandSelectedKeysMap}
        let _map = list.reduce((prev, curr) => {
            prev[curr[key]] = curr
        }, {})
        if(list.length){
            _expandSelectedKeysMap[mainKey] = {
                keys,
                list,
                map: _map
            }
        }
        else{
            if(_expandSelectedKeysMap[mainKey]){
                delete _expandSelectedKeysMap[mainKey]
            }
        }
        setExpandSelectedKeysMap(_expandSelectedKeysMap)
    }

    function clearExpandKeys(){
        setExpandSelectedKeysMap({})
    }

    useEffect(() => {
        if(keys.length){
            setExpandKeys(keys, list, key, mainKey)
        }
    }, [])

    return [ expandSelectedKeysMap, setExpandKeys, clearExpandKeys ]
}