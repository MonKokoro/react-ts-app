/** 需要遮罩的请求接口计数reducer */

import { createSlice } from '@reduxjs/toolkit'

export const needMaskCountSlice = createSlice({
    name: 'needMaskCount',
    initialState: 0,
    reducers: {
        increment: (state) => (state + 1),
        decrement: (state) => (state - 1),
    },
})

export const { increment, decrement } = needMaskCountSlice.actions

export default needMaskCountSlice.reducer;