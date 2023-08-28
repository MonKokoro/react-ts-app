/* 公共抽屉组件 */

import React, { useState, useEffect } from "react"
import { Drawer, Button } from 'antd'
import './index.less'

function CommonDrawer({
    open,
    title,
    className,
    width,
    doNotDestory,
    forceRender,
    children,
    buttonList,
    onClose
}: CommonDrawerProps){
    const [ show, setShow ] = useState(false)

    useEffect(() => {
        setShow(open || false)
    }, [open])

    return <Drawer
        className={`common-drawer-component ${className || ''}`}
        width={width || 720}
        onClose={() => {
            onClose()
        }}
        visible={show}
        destroyOnClose={doNotDestory ? false : true}
        forceRender={forceRender}
        closable={false}
    >
        <div className="common-drawer">
            <div className='common-drawer-header'>
                <div className="common-drawer-title"><i></i>{title}</div>
                <div className="common-drawer-button">
                    <Button onClick={() => {
                        onClose()
                    }}>返回</Button>
                    {buttonList && buttonList.map((item, index) => {
                        return <Button 
                            onClick={() => {
                                item.onClick()
                            }}
                            type={item.type || 'primary'}
                            key={index}
                            style={{marginLeft: 6}}
                        >{item.text}</Button>
                    })}
                </div>
            </div>
            <div className='common-drawer-context'>
                {show ? children : ''}
            </div>
        </div>
    </Drawer>
}

type ButtonListItemProps = {
    text: string,
    onClick: () => void,
    type?: 'primary' | 'dashed' | 'link' | 'text' | 'default'
}
type CommonDrawerProps = {
    open: boolean,
    title: string | React.ReactNode,
    className?: string,
    width?: number,
    doNotDestory?: boolean,
    forceRender?: boolean,
    children?: React.ReactNode,
    buttonList?: ButtonListItemProps[]
    onClose: () => void
}
export default CommonDrawer