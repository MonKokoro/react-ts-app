/** 拖拽测试 */

import React, { useState, useRef } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, useDrag, useDrop } from 'react-dnd' 
import './index.less'

import Drag from './drag';
// import Drop from './drop';

/** 实现拖拽 */
// function Drag(){
//     const [ collectedProps, drag ] = useDrag({
//         type: 'KEY'
//     })
//     return <div ref={drag}>Drag</div>
// }

/** 实现放置 */
// function Drop(){
//     const [ collectedProps, drop ] = useDrop({
//         accept: 'KEY'
//     })
//     return <div ref={drop}>Drop Area</div>
// }

function DragTest() {
    return <div className="drag-test">
        <div className='drag-content'>
            <DndProvider backend={HTML5Backend}>
                <Drag/>
                {/* <Drop/> */}
            </DndProvider>
        </div>
    </div>
}

export default DragTest;