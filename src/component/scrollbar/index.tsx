import React, { useState, useEffect, useRef } from 'react';
import './index.less'

function Scrollbar({
    style,
    height,
    children
}: ScrollbarProps) {
    const componentRef = useRef<HTMLDivElement>()
    const contentRef = useRef<HTMLDivElement>()
    const [ componentHeight, setComponentHeight ] = useState<number>(0)
    const [ contentHeight, setContentHeight ] = useState<number>(0)

    const [ isMouseDown, setIsMouseDown ] = useState<boolean>(false); //鼠标是否按下
    const [ scrollPosition, setScrollPosition ] = useState<number>(0); //记录滚动位置

    useEffect(() => {
        setComponentHeight(componentRef.current.clientHeight)
    }, [componentRef.current])

    useEffect(() => {
        // console.log(contentRef.current.clientHeight)
        setContentHeight(contentRef.current.clientHeight)
    }, [contentRef.current])

    /** 计算滚动条长度和初始位置的方法 */
    // function calculateHeight(){
    //     if(componentHeight && contentHeight){
    //         if(contentHeight > componentHeight){
    //             return {
    //                 height: `${componentHeight/contentHeight*100}%`,
    //             }
    //         }
    //         else{
    //             return {
    //                 height: `100%`
    //             }
    //         }
    //     }
    //     else{
    //         return {
    //             height: `100%`
    //         }
    //     }
    // }

    const usedStyle = { height, ...style }
    const thumbStyle = {
        height: `${componentHeight/contentHeight*100}%`,
        // transform: `translateY(50%)`
    }
    return <div 
        className="scrollbar-component" 
        style={usedStyle} 
        ref={componentRef}
        onMouseEnter={() => console.log("onMouseEnter")}
    >
        {contentHeight > componentHeight && <div className="scrollbar-component-bar">
            <div className="scrollbar-component-thumb" style={thumbStyle}/>
        </div>}
        <div className='scrollbar-component-content' ref={contentRef}>
            {children}
        </div>
    </div>
}

export type ScrollbarProps = {
    style?: any,
    height?: string | number,
    children?: React.ReactNode
}
export default Scrollbar;