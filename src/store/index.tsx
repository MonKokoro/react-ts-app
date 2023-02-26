import { configureStore } from '@reduxjs/toolkit'
import needMaskCount from './needMaskCount';

const store = configureStore({
    reducer: {
        needMaskCount,
    }
})

export default store