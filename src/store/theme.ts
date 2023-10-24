/** 主题色。目前为一种，未来或许可以尝试支持渐变主题色 */

import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
    name: 'theme',
    // initialState: window.localStorage.getItem("theme") || "#13547A",
    initialState: window.localStorage.getItem("theme") || "darkGreen",
    reducers: {
        themeSet: (state: string, action) => {
            return state = action.payload
        }
    },
})

export const { themeSet } = themeSlice.actions

export default themeSlice.reducer;