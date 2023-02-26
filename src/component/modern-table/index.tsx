import React, { useState, useImperativeHandle, useRef, ReactNode } from 'react';
import useDeepEffect from "@/hooks/useDeepEffect"
import AdvancedSearchForm from "./advanced-search-form";
import TableContent from "./table-content"

import useDataList from './hooks/useDataList';
import useSelectedKeysMap from './hooks/useSelectedKeysMap';
import useExpandSelectedKeysMap from './hooks/useExpandSelectedKeysMap';

import lib from '../../lib';
import "./index.less"

function ModernTable({ 
    actionRef,

    searchConfig = [], 
    method = "GET",
    url, 
    defaultData = {}, 
    
    rowKey = "id",
    column = [],
    scroll = {},
    topRender,
    leftButtonList = [],
    rowSelect,
    rowDisabled,
    expand,
    
    tableProps = {}
}: ModernTableProps){
    const ref = actionRef || useRef()
    
    const [ dataList, setDataList ] = useDataList([])
    const [ page, setPage ] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    })
    const [ param, setParam ] = useState({})
    const [ usedColumn, setUsedColumn ] = useState<any[]>([])
    const [ selectedKeysMap, addKeys, deleteKeys, clearKeys ] = useSelectedKeysMap()
    const [ expandSelectedKeysMap, setExpandKeys, clearExpandKeys ] = useExpandSelectedKeysMap()

    const [ clearSearch, setClearSearch ] = useState(0)

    useDeepEffect(() => {
        search({current: 1, pageSize: page.pageSize}, param, true)
    }, [defaultData])

    useDeepEffect(() => {
        const result: any = column.reduce((prev: object[], curr: any) => {
            if (!curr.hidden)
                prev.push(curr);
            return prev;
        }, [])
        setUsedColumn(result);
    }, [column])

    useImperativeHandle(ref, () => ({
        /** 搜索方法 */
        search: () => { search( page, param, true ) },
        /** 重置方法 */
        reset: () => { search( page, param, true ) },
        /** 获取搜索条件对象 */
        getSearchingValues: () => { return param },
        /** 清除搜索条件 */
        clearSearch: () => { setClearSearch( clearSearch + 1 ) },
        /** 获取已选中的key值数组 */
        /** 注意！通过Object.keys转换的key值全部为字符串格式，如果业务中的rowKey值为数值或其他类型，请务必谨慎 */
        getSelectedKeys: () => { return Object.keys(selectedKeysMap) },
        /** 获取已选中的key值映射 */
        getSelectedKeysMap: () => { return selectedKeysMap },
        /** 获取子表已选中的key值数组 */
        getExpandSelectedKeys: () => {
            const expandMap = actionRef.current.getExpandSelectedKeysMap() || {}
            let expand = []
            for(let key in expandMap){
                expand.push(expandMap[key].keys)
            }
            return expand
        },
        /** 获取子表已选中的key值映射 */
        getExpandSelectedKeysMap: () => { return expandSelectedKeysMap },
        /** 设置已选中的key值 */
        /** 注意！如果仅传入key值列表，那由于无法取到本行的详细数据，映射表中对应的行将被占位符替代 */
        /** 因此本方法并不安全，在某些复杂或坑爹需求下可能会产生一些奇怪的问题 */
        setSelectedKeys: (keys) => {
            const result = keys.reduce((prev, curr) => {
                prev.push({[rowKey]: curr})
                return prev
            }, [])
            return addKeys(result)
        },
        /** 清除已选中的key值 */
        clearSelectedKeys: () => {
            clearKeys()
            clearExpandKeys()
        },
        /** 清除列表数据 */
        clearDataList: () => { return setDataList([]) }
    }))

    function search(page = {}, param, clear){
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
            success: (data, res) => {
                setPage({
                    current: data.current,
                    pageSize: data.size,
                    total: data.total
                })
                setParam(param)
                setDataList(
                    data.records.reduce((prev, curr, index) => {
                        prev.push({...curr, index})
                        return prev
                    }, [])
                )
                if(clear){
                    clearKeys()
                    clearExpandKeys()
                }
            }
        })
    }

    return <div className='modern-table'>
        {searchConfig.length ? <AdvancedSearchForm 
            searchConfig={searchConfig}
            method={method}
            url={url}
            search={(values) => {
                search({current: 1, pageSize: page.pageSize}, values, true)
            }}
            clearSearch={clearSearch}
        /> : ''}
        <TableContent 
            column={usedColumn} 
            actionRef={ref} 
            rowKey={rowKey}
            leftButtonList={leftButtonList} 
            rowSelect={rowSelect} 
            rowSelectFunction={{selectedKeysMap, addKeys, deleteKeys, clearKeys}}
            expand={expand}
            expandSelectFunction={{expandSelectedKeysMap, setExpandKeys, clearExpandKeys}}
            rowDisabled={rowDisabled}
            url={url}
            scroll={scroll}
            page={page}
            dataList={dataList.list}
            search={(pages) => {
                search(pages, param)
            }}
            topRender={topRender}

            tableProps={tableProps}
        />
    </div>
}
export type searchConfigProps = {

}
export type leftButtonListProps = {

}
export type rowSelectProps = {

}
export type ModernTableProps = {
    actionRef: any
    searchConfig?: searchConfigProps[]
    method?: "GET" | "POST"
    url: string
    defaultData: object
    rowKey?: string
    column: object[]
    scroll?: { x?: number, y?: number }
    topRender?: ReactNode
    leftButtonList?: leftButtonListProps[]
    rowSelect?: rowSelectProps | boolean
    rowDisabled?: () => boolean
    expand?: boolean
    tableProps?: object
}
export default ModernTable