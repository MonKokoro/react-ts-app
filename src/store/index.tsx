import { configureStore } from '@reduxjs/toolkit'
import needMaskCount from './needMaskCount';
import collapsed from './collapsed';

const store = configureStore({
    reducer: {
        needMaskCount,
        collapsed
    }
})

export default store