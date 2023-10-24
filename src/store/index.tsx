import { configureStore } from '@reduxjs/toolkit'
import needMaskCount from './needMaskCount';
import collapsed from './collapsed';
import theme from './theme';
import pageList from './pageList';

const store = configureStore({
    reducer: {
        needMaskCount,
        collapsed,
        theme,
        pageList
    }
})

export default store