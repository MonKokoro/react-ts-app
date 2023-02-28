/** 需要遮罩的请求接口计数reducer */

import { createSlice } from '@reduxjs/toolkit'

export const needMaskCountSlice = createSlice({
    name: 'needMaskCount',
    initialState: 0,
    reducers: {
        addMask: (state) => {
            return state + 1
        },
        decreaseMask: (state) => {
            if(state <= 0)
                return 0
            return state - 1
        },
        resetMask: () => { return 0 }
    },
})

export const { addMask, decreaseMask, resetMask } = needMaskCountSlice.actions

export default needMaskCountSlice.reducer;