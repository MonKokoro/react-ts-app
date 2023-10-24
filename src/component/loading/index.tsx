import React from 'react';
import store from '@/store';
import './index.less'

function Loading() {
    return <div className={`loading-spinner loading-spinner-${store.getState().theme}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
}

export default Loading;