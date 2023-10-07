/** 多标签模式下打开页面列表reducer */

import { createSlice } from '@reduxjs/toolkit'

export const pageListSlice = createSlice({
    name: 'pageList',
    initialState: [
        {key: "/home", routeKey: "home", label: "首页", param: {}, closeIcon: false}
    ],
    reducers: {
        addPage: (state: pageListItemProps[], action) => {
            const newPage: any = action.payload
            return state = [...state, newPage]
        },
        removePage: (state: pageListItemProps[], action) => {
            const targetPageKey: string = action.payload
            return state = state.reduce((prev, curr) => {
                if(curr.key !== targetPageKey)
                    prev.push(curr)
                return prev
            }, [])
        },
        clearPage: (state: pageListItemProps[]) => {
            return state = [
                {key: "/home", routeKey: "home", label: "首页", param: {}, closeIcon: false}
            ]
        },
        setPages: (state: pageListItemProps[], action) => {
            return state = [...action.payload]
        }
    },
})

export type pageListItemProps = {
    /** 路由tab名称 */
    label: string,
    /** 路由唯一key值，与地址栏带参数url路由等效 */
    key: string,
    /** 路由key值，用于寻找相应的页面 */
    routeKey: string,
    /** tab参数 */
    param?: any,
    /** 是否可关闭 */
    closeIcon?: boolean
}
export const { addPage, removePage, clearPage, setPages } = pageListSlice.actions

export default pageListSlice.reducer;