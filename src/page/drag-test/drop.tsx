/** 拖拽测试 - 拖拽源 */

import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd' 
import axios from '@/axios'

function Drop() {
    const [ list, setList ] = useState<any[]>([])
    const [collectProps, drop] = useDrop({
		accept: "Box",
		collect: (monitor) => ({
			isActive: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
		drop: (item, monitor) => {
			const dropPoint = monitor.getClientOffset()
			const dragData = item.data
			
 
			arr.push({ ...dragData, id: Math.floor(Math.random() * 1000 + 1) })
			console.log(arr)
			it.srcTableName))
			
		},
	})
    
    useEffect(() => {
        
    }, [])

    return <div className="drop-component">
        {list.map(item => {
            return <div className='drop-item'>
                {item.chineseName}
            </div>
        })}
    </div>
}

export default Drop;