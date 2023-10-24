/** 动效组件 - 按钮 */

import React, { useState, useRef } from 'react';
import store from '@/store';
import './index.less'

function HoverButton({
    className,
    children,
    onClick = () => {},
    props = {},
    icon
}: HoverButtonProps) {
    return <button 
        className={`hover-button hover-button-${store.getState().theme}${!icon ? ' hover-button-noicon' : ' '} ${className}`} 
        onClick={() => onClick()}
        {...props}
    >
        <p>{children}</p>
        {icon ? <span className='hover-button-icon'>{icon}</span> : ''}
    </button>
}

export type HoverButtonProps = {
    className?: string,
    children: React.ReactNode | string,
    onClick?: () => void,
    props?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
    icon?: React.ReactNode
}
export default HoverButton;