import React, { useState, useEffect } from "react"
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { ConfigProvider, Input, Avatar, Spin } from 'antd';
import { SkinFilled, DownOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import './index.less'

import Menu from '@/menu'
import { routeList } from "@/router";
import store from "@/store";

function Layout () {
    const location = useLocation();
    const navigate = useNavigate();
    const currentOutlet = useOutlet()
    const [ userName, setUserName ] = useState<string>()
    const [ maskCount, setMaskCount ] = useState<number>(0)
    // const [ theme, setTheme ] = useState<string>(window.localStorage.getItem("theme") || "#13547a")

    useEffect(() => {
        if(window.localStorage.getItem("userName")){
            setUserName(window.localStorage.getItem("userName"))
        }
        else{
            navigate('/login')
        }
    }, [])

    store.subscribe(() => {
        setMaskCount(store.getState().needMaskCount)
    })

    const { nodeRef } = routeList.find((route) => route.path === location.pathname) || {}

    return <ConfigProvider
        locale={zhCN}
        theme={{
            token: { colorPrimary: "#13547a" },
        }}
    >
        <div className='layout'>
            <Menu />
            <div className='content-box'>
                <div className='header'>
                {/* <div className='header' style={{background: `linear-gradient(to right, ${theme}, #80D0A7)`}}> */}
                    <div className="left">
                        <Input />
                    </div>
                    <div className="right">
                        {/** 已确认皮肤更换功能不适合本系统样式，将其废弃 */}
                        {/* <div className="skin">
                            <SkinFilled className="skin-icon" color="white" />
                            <div className="skin-modal">
                                <div className="title">选择主题</div>
                                <div className="content">
                                    <div className="color-box" style={{background: "#13547a"}} onClick={() => {
                                        setTheme("#13547a")
                                        window.localStorage.setItem("theme", "#13547a")
                                    }}/>
                                    <div className="color-box" style={{background: "#1677ff"}} onClick={() => {
                                        setTheme("#1677ff")
                                        window.localStorage.setItem("theme", "#1677ff")
                                    }}/>
                                    <div className="color-box" />
                                    <div className="color-box" />
                                    <div className="color-box" />
                                    <div className="color-box" />
                                    <div className="color-box" />
                                </div>
                            </div>
                        </div> */}
                        <div className="user">
                            <Avatar className="user-avatar" src={<img src={require("@/assets/image/anya.png")} />} />
                            <span className="user-name">{userName}</span>
                            <DownOutlined className="user-arrow"/>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <CSSTransition
                        in={maskCount ? true : false}
                        timeout={200}
                        classNames="mask-fade"
                        unmountOnExit
                    >
                        <div className="mask">
                            <Spin tip="加载中，请稍后..."/>
                        </div>
                    </CSSTransition>
                    <SwitchTransition>
                        <CSSTransition
                            key={location.pathname}
                            nodeRef={nodeRef}
                            timeout={300}
                            classNames="fade"
                            unmountOnExit
                        >
                            {() => (
                                <div ref={nodeRef} className="content-side">
                                    {currentOutlet}
                                </div>
                            )}
                        </CSSTransition>
                    </SwitchTransition>
                </div>
            </div>
        </div>
    </ConfigProvider>
}

export default Layout;