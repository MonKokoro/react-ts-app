import React, { useState, useImperativeHandle, useRef, ReactNode, useContext, createContext } from 'react';
import { Pagination } from 'antd';
import useDeepEffect from "@/hooks/useDeepEffect"
import AdvancedSearchForm from "./advanced-search-form";
import TableContent, { leftButtonListProps, rowSelectProps, expandProps } from "./table-content"

import useDataList from './hooks/useDataList';
import useSelectedKeysMap from './hooks/useSelectedKeysMap';
import useExpandSelectedKeysMap from './hooks/useExpandSelectedKeysMap';

// import { Context, ContextProvider, ContextConsumer } from './context';

import lib from '@/lib';
import "./index.less"

const TableContext = createContext(null)

type pageType = {
    current: number
    pageSize: number
    total: number
}

function ModernTable({ 
    actionRef,

    searchConfig = [], 
    method = "GET",
    url, 
    defaultData = {}, 
    
    rowKey = "id",
    columns = [],
    scroll = {},
    topRender,
    leftButtonList = [],
    rowSelect,
    rowDisabled,
    expand,
    paginationFixed = true,
    
    tableProps = {}
}: ModernTableProps){
    const ref = actionRef || useRef()

    const [ usedColumn, setUsedColumn ] = useState<any[]>([])
    const [ page, setPage ] = useState<pageType>({
        current: 1,
        pageSize: 0,
        total: 0
    })
    const [ param, setParam ] = useState<object>({})
    const [ dataList, setDataList ] = useState<object[]>([])
    const [ loading, setLoading ] = useState<boolean>(false)

    const { selectedKeysMap, selectedCount, addKeys, deleteKeys, clearKeys } = useSelectedKeysMap(rowKey)
    const { expandSelectedKeysMap, expandSelectedRowsMap, expandSelectedCount, setExpandKeys, clearExpandKeys } = useExpandSelectedKeysMap(expand ? expand.rowKey : "id")

    const [ clearSearch, setClearSearch ] = useState(0)

    useDeepEffect(() => {
        search({current: 1, pageSize: page.pageSize}, param, true)
    }, [defaultData])

    useDeepEffect(() => {
        const result: any = columns.reduce((prev: object[], curr: any) => {
            if (!curr.hidden)
                prev.push(curr);
            return prev;
        }, [])
        setUsedColumn(result);
    }, [columns])

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
            let expand = []
            for(let key in expandSelectedKeysMap){
                expand.push(expandSelectedKeysMap[key])
            }
            return expand
        },
        /** 获取子表已选中的key值映射 */
        getExpandSelectedKeysMap: () => { return expandSelectedKeysMap },
        /** 获取子表已选中的完整数据映射 */
        getExpandSelectedRowsMap: () => { return expandSelectedRowsMap },
        /** 设置已选中的key值 */
        /** 注意！如果仅传入key值列表，那由于无法取到本行的详细数据，映射表中对应的行将被占位符替代 */
        /** 因此本方法并不安全，在某些复杂或坑爹需求下可能会产生一些奇怪的问题 */
        // setSelectedKeys: (keys) => {
        //     const result = keys.reduce((prev, curr) => {
        //         prev.push({[rowKey]: curr})
        //         return prev
        //     }, [])
        //     return addKeys(result)
        // },
        // /** 清除已选中的key值 */
        // clearSelectedKeys: () => {
        //     clearKeys()
        //     clearExpandKeys()
        // },
        // /** 清除列表数据 */
        // clearDataList: () => { return setDataList([]) }
    }))

    function search(page: { current: number, pageSize: number }, param: object, clear: boolean){
        setLoading(true)
        lib.request({
            url,
            method,
            data: {
                ...param,
                pageNum: page.current || 1,
                pageSize: page.pageSize || 5,
                ...defaultData
            },
            success: (data: any) => {
                setTimeout(() => setLoading(false), 300)
                setPage(data.page)
                setParam(param)
                setDataList(data.list)
                if(clear){
                    clearKeys()
                    clearExpandKeys()
                }
            },
            fail: () => setTimeout(() => setLoading(false), 300)
        })
    }

    return <div className='modern-table'>
        <TableContext.Provider
            value={{
                page,
                setPage,
                param,
                setParam,
                dataList,
                setDataList,
                loading,

                search,

                selectedCount,
                addKeys,
                deleteKeys,
                clearKeys,

                expandSelectedCount,
                expandSelectedKeysMap,
                setExpandKeys,
                clearExpandKeys
            }}
        >
            {searchConfig.length ? <AdvancedSearchForm 
                searchConfig={searchConfig}
                clearSearch={clearSearch}
            /> : ''}
            <TableContent 
                columns={usedColumn} 
                rowKey={rowKey}
                leftButtonList={leftButtonList} 
                rowSelect={rowSelect} 
                expand={expand}
                rowDisabled={rowDisabled}
                scroll={scroll}
                topRender={topRender}
                paginationFixed={paginationFixed}

                tableProps={tableProps}
            />
            <div className={paginationFixed ? "content-fixed-pagination" : "content-table-pagination"}>
                <Pagination 
                    current={page.current || 1} 
                    total={page.total || 0} 
                    pageSize={page.pageSize || 5}
                    showTotal={total => `共 ${total} 条`}
                    pageSizeOptions={["5", "10", "20", "50", "100"]}
                    showSizeChanger
					showQuickJumper
                    onChange={(current, pageSize) => search({current, pageSize}, param, false)}
                    defaultCurrent={1}
                    defaultPageSize={5}
                />
            </div>
        </TableContext.Provider>
    </div>
}
export type searchConfigProps = {

}
export type ModernTableProps = {
    type?: "page" | "component"
    actionRef: any
    searchConfig?: searchConfigProps[]
    method?: "GET" | "POST"
    url: string
    defaultData?: object
    rowKey?: string
    columns: object[]
    scroll?: { x?: number, y?: number }
    topRender?: ReactNode
    leftButtonList?: leftButtonListProps[]
    rowSelect?: rowSelectProps | boolean
    rowDisabled?: (record: any) => boolean
    expand?: expandProps | false
    paginationFixed?: boolean
    tableProps?: object
}

export type ModernTableRef = {
    search: () => void;
    reset: () => void;
    getSearchingValues: () => object;
    clearSearch: () => void;
    getSelectedKeys: () => string[];
    getSelectedKeysMap: () => any;
    getExpandSelectedKeys: () => any[];
    getExpandSelectedKeysMap: () => any;
    getExpandSelectedRowsMap: () => any;
}

export { TableContext }
export default ModernTable