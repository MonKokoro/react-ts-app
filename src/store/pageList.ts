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
            // if(state.some(record => record.key === newPage.key))
            //     return
            return state = [...state, newPage]
        },
        removePage: (state: pageListItemProps[], action) => {
            const targetPage: any = action.payload
            return state = state.reduce((prev, curr) => {
                if(curr.key !== targetPage.key)
                    prev.push(curr)
                return prev
            }, [])
        },
        clearPage: (state: pageListItemProps[]) => {
            return state = [
                {key: "/home", routeKey: "home", label: "首页", param: {}, closeIcon: false}
            ]
        }
    },
})

export type pageListItemProps = {
    label: string,
    key: string,
    routeKey: string,
    param?: any,
    closeIcon?: boolean
}
export const { addPage, removePage, clearPage } = pageListSlice.actions

export default pageListSlice.reducer;