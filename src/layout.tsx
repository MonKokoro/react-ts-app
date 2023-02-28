import React, { useState, useEffect } from "react"
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { ConfigProvider, Input, Avatar, Spin } from 'antd';
import { SkinFilled, DownOutlined } from '@ant-design/icons';
import zhCN from "antd/lib/locale/zh_CN"
import './layout.less'

import Menu from './menu'
import { routeList } from "./router";
import store from "./store";

function Layout () {
    const location = useLocation();
    const navigate = useNavigate();
    const currentOutlet = useOutlet()
    const [ userName, setUserName ] = useState<string>()
    const [ maskCount, setMaskCount ] = useState<number>(0)

    useEffect(() => {
        if(window.localStorage.getItem("userName")){
            setUserName(window.localStorage.getItem("userName"))
        }
        else{
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        console.log(maskCount)
    }, [maskCount])

    store.subscribe(() => {
        setMaskCount(store.getState().needMaskCount)
    })

    const { nodeRef } = routeList.find((route) => route.path === location.pathname) || {}

    return <ConfigProvider
        locale={zhCN}
        theme={{
            token: { colorPrimary: '#00b96b' },
        }}
    >
        <div className='layout'>
            <div className="menu-box">
                <div className="logo">MonShin花园</div>
                <div className="menu">
                    <Menu />
                </div>
            </div>
            <div className='content-box'>
                <div className='header'>
                    <div className="left">
                        <Input />
                    </div>
                    <div className="right">
                        <div className="skin">
                            <SkinFilled className="skin-icon" color="white" />
                        </div>
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
                            {(state) => (
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