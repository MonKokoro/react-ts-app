import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.less'

function Scrollbar({
    style,
    height,
    children
}: ScrollbarProps) {
    const componentRef = useRef<HTMLDivElement>()
    const contentRef = useRef<HTMLDivElement>()
    const hoverRef = useRef<boolean>(false)
    const driftRef = useRef<number>(0)
    const [ componentHeight, setComponentHeight ] = useState<number>(0)
    const [ contentHeight, setContentHeight ] = useState<number>(0)

    const [ isMouseDown, setIsMouseDown ] = useState<boolean>(false); //鼠标是否按下
    const [ scrollPosition, setScrollPosition ] = useState<number>(0); //记录滚动位置

    useEffect(() => {
        setComponentHeight(componentRef.current.clientHeight)
    }, [componentRef.current])

    useEffect(() => {
        setContentHeight(contentRef.current.clientHeight)
    }, [contentRef.current])

    /** 监听浏览器大小变化 */
    useEffect(() => {
        window.addEventListener(`resize`, getHeight, {passive: true});
        return () => {
            window.removeEventListener(`resize`, getHeight);
        }
    }, [])

    useEffect(() => {
        document.addEventListener('wheel', wheelMove, {passive: true});
        return () => {
            document.removeEventListener('wheel', wheelMove);
        };
    }, [scrollPosition, contentHeight, componentHeight])

    useEffect(() => {
        if(isMouseDown){
            document.addEventListener('mousemove', mouseMove, {passive: true});
        }
        else{
            document.removeEventListener('mousemove', mouseMove);
        }
        return () => {
            if (document) {
                document.removeEventListener('mousemove', mouseMove);
            }
        };
    }, [isMouseDown, scrollPosition, contentHeight, componentHeight])

    /** 高度赋值 */
    function getHeight(){
        // console.log(componentRef.current.clientHeight, contentRef.current.clientHeight)
        setComponentHeight(componentRef.current.clientHeight)
        setContentHeight(contentRef.current.clientHeight)
    }

    /** 鼠标滚轮滚动事件。当鼠标在区域内滚动滚轮，则触发内容滚动事件 */
    function wheelMove(e: WheelEvent){
        const deltaY = e.deltaY
        if(!hoverRef.current)
            return
        if(contentHeight <= componentHeight)
            return
        // 下移
        if(deltaY > 0){
            if(scrollPosition + deltaY > contentHeight - componentHeight){
                setScrollPosition(contentHeight - componentHeight)
            }
            else{
                setScrollPosition(scrollPosition + deltaY)
            }
        }
        // 上移
        else{
            if(scrollPosition + deltaY < 0){
                setScrollPosition(0)
            }
            else{
                setScrollPosition(scrollPosition + deltaY)
            }
        }
    }

    const mouseMove = useCallback((e: MouseEvent) => {
        const clientY = e.clientY
        if(!isMouseDown)
            return
        /** 计算的关键：把手高度和组件高度之比 与 组件高度和组件内容高度之比 相等 */
        const contentDrift = (clientY - driftRef.current) * contentHeight / componentHeight
        // 下移
        if(contentDrift > 0){
            if(scrollPosition + contentDrift > contentHeight - componentHeight){
                setScrollPosition(contentHeight - componentHeight)
            }
            else{
                setScrollPosition(scrollPosition + contentDrift)
            }
        }
        // 上移
        else{
            if(scrollPosition + contentDrift < 0){
                setScrollPosition(0)
            }
            else{
                setScrollPosition(scrollPosition + contentDrift)
            }
        }
    }, [isMouseDown])

    const usedStyle = { height, ...style }
    const thumbStyle = {
        height: `${componentHeight/contentHeight*100}%`,
        /** 滚动条把手的高度与组件高度是相对的，因此要算出把手相对自身的位移百分比，只需以下的比值即可 */
        transform: `translateY(${scrollPosition/componentHeight*100}%)`
    }
    const contentStyle = {
        top: -scrollPosition
    }
    return <div 
        className="scrollbar-component" 
        style={usedStyle} 
        ref={componentRef}
        onMouseEnter={() => hoverRef.current = true}
        onMouseLeave={() => hoverRef.current = false}
        onMouseDown={(e) => {
            e.stopPropagation()
            setIsMouseDown(true)
            driftRef.current = e.clientY

            document.addEventListener('mouseup', (e: MouseEvent) => {
                setIsMouseDown(false);
                driftRef.current = 0
                document.removeEventListener('mousemove', mouseMove);
            });
        }}
        draggable={false}
    >
        {contentHeight > componentHeight && <div className="scrollbar-component-bar">
            <div 
                className={`scrollbar-component-thumb ${isMouseDown ? 'scrollbar-component-thumb-clicked' : ''}`} 
                style={thumbStyle}
            />
        </div>}
        <div 
            className={`scrollbar-component-content ${isMouseDown ? 'scrollbar-component-content-clicked' : ''}`}
            style={contentStyle} 
            ref={contentRef} 
            draggable={false}
        >
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