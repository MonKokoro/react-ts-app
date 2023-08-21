/** 拖拽测试 - 拖拽源 */

import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd' 
import axios from '@/axios'
// import './index.less'


function TableItem({ item = {}, key }:TableItemProps) {
	const [, drag] = useDrag({
		type: "Box",
		item: { data: { item } },
	})
	return <div className='drag-item' key={key} ref={drag}>
        {item.chineseName}
    </div>
}

function Drag() {
    const [ list, setList ] = useState<any[]>([])
    
    useEffect(() => {
        getList()
    }, [])

    function getList(){
        axios.request({
            url: "/mock/getMemberList",
            method: "GET"
        }).then( ({data}) => {
            setList(data)
        })
    }

    return <div className="drag-component">
        {list.map((item, index) => {
            return <TableItem key={index} item={item} />
            // return <div className='drag-item' key={index}>
            //     {item.chineseName}
            // </div>
        })}
    </div>
}

export default Drag;

interface TableItemProps {
    item: any,
    key: string | number
}