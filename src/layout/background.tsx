/** 为保证可读性，将header背景的渐变实现拆分到组件中 */

/**
 * 背景颜色为渐变时，transition渐变效果将无法生效
 * 这里的解决方案：设置两层背景，使用透明度动画实现
 */

import React, { useState, useEffect } from "react"

type BackgroundProps = {
    color: string
}

function Background({ color }: BackgroundProps){
    const [ bottomColor, setBottomColor ] = useState(color)
    const [ transition, setTransition ] = useState(false)

    useEffect(() => {
        setTransition(true)
        setTimeout(() => {
            setBottomColor(color)
            setTransition(false)
        }, 200)
    }, [color])

    return <>
        <div 
            className={`background background-top ${transition ? "background-transition" : ""}`} 
            style={{background: `linear-gradient(to right, ${color}, #80D0A7)`}} 
        />
        <div className="background" style={{background: `linear-gradient(to right, ${bottomColor}, #80D0A7)`}} />
    </>
}

export default Background