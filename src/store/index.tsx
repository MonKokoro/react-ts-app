import { configureStore } from '@reduxjs/toolkit'
import needMaskCount from './needMaskCount';
import collapsed from './collapsed';
import pageList from './pageList';

const store = configureStore({
    reducer: {
        needMaskCount,
        collapsed,
        pageList
    }
})

export default store