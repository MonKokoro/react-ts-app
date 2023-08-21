import React, { useState, useRef } from 'react';
import './index.less'

import Scrollbar from '@/component/scrollbar';

function ScrollbarTest() {
    const kitaList = [
        { value: 1, desc: "キタ—————— × 1" },
        { value: 2, desc: "キタ—————— × 2" },
        { value: 3, desc: "キタ—————— × 3" },
        { value: 4, desc: "キタ—————— × 4" },
        { value: 5, desc: "キタ—————— × 5" },
        { value: 6, desc: "キタ—————— × 6" },
        { value: 7, desc: "キタ—————— × 7" },
        { value: 8, desc: "キタ—————— × 8" },
        { value: 9, desc: "キタ—————— × 9" },
        { value: 10, desc: "キタ—————— × 10" },
        { value: 11, desc: "キタ—————— × 11" },
        { value: 12, desc: "キタ—————— × 12" },
    ]
    return <div className="scrollbar-test">
        <Scrollbar height={300}>
            <div className='scrollbar-test-card'>
                {kitaList.map(item => {
                    return <div className='test-item' key={item.value}>{item.desc}</div>
                })}
            </div>
        </Scrollbar>
    </div>
}

export default ScrollbarTest;