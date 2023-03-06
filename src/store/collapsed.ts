/** 左侧菜单是否收起，由于自适应布局下直接对整个页面重绘似乎有明显的卡顿，因此尝试将其提到redux中公用管理，尝试固定不同菜单模式下的页面宽度 */

import { createSlice } from '@reduxjs/toolkit'

export const collapsedSlice = createSlice({
    name: 'collapsed',
    initialState: false,
    reducers: {
        setCollapsed: (state: boolean) => {
            return state
        }
    },
})

export const { setCollapsed } = collapsedSlice.actions

export default collapsedSlice.reducer;