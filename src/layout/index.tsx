import React, { useState, useEffect } from "react"
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { ConfigProvider, Input, Avatar, Spin, Breadcrumb } from 'antd';
import { SkinFilled, DownOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import './index.less'

import Menu from '@/menu'
import { routerMap, routeList, breadcrumbMap } from "@/router";
import store from "@/store";

import Background from "./background";

function Layout () {
    const location = useLocation();
    const navigate = useNavigate();
    const currentOutlet = useOutlet()
    const [ userName, setUserName ] = useState<string>()
    const [ maskCount, setMaskCount ] = useState<number>(0)
    const [ theme, setTheme ] = useState<string>(window.localStorage.getItem("theme") || "#13547A")
    const [ breadcrumbItems, setBreadcrumbItems ] = useState<any>([])

    useEffect(() => {
        if(window.localStorage.getItem("userName")){
            setUserName(window.localStorage.getItem("userName"))
        }
        else{
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        const pathname = location.pathname.replace('/', '')
        let result = [{title: "首页"}]
        if(breadcrumbMap[pathname]){
            result = breadcrumbMap[pathname].reduce((prev: any, curr: any) => {
                console.log(routerMap[curr], curr)
                prev.push({
                    title: routerMap[curr] ? 
                        <a onClick={() => navigate(`/${curr}`)}>{routerMap[curr][1]}</a>
                        :
                        curr,
                })
                return prev
            }, [])
            result.push({
                title: routerMap[pathname][1]
            })
        }
        setBreadcrumbItems(result)

    }, [location.pathname])

    store.subscribe(() => {
        setMaskCount(store.getState().needMaskCount)
    })

    /** 路由ref */
    const { nodeRef } = routeList.find((route) => route.path === location.pathname) || {}

    /** 主题色 */
    const colorList = ["#13547A", "#1677FF", "#CE9C9D", "#ABD5BE", "#E0B394"]

    /** 面包屑内容 */
    // let breadcrumbItems = breadcrumbMap[location.pathname] ? 
    //     breadcrumbMap[location.pathname].reduce((prev: any, curr: any) => {
    //         prev.push({
    //             title: routerMap[curr] ? 
    //                 <a onClick={() => navigate(routerMap[curr][1])}>{routerMap[curr][2]}</a>
    //                 :
    //                 curr,
    //         })
    //     }, [])
    //     :
    //     [{title: "首页"}]

    return <ConfigProvider
        locale={zhCN}
        theme={{
            token: { colorPrimary: theme },
        }}
    >
        <div className='layout'>
            {/** 最顶部header */}
            <div className='header'>
                <div className="left">
                    <div className="logo">MonShin花园</div>
                </div>
                <div className="right">
                    <div className="skin">
                        <SkinFilled className="skin-icon" color="white" />
                        <div className="skin-modal">
                            <div className="title">选择主题</div>
                            <div className="content">
                                {colorList.map(color => {
                                    return <div 
                                        key={color}
                                        className={`color-box ${theme === color ? "color-focus" : ""}`}
                                        style={{background: color}} 
                                        onClick={() => {
                                            setTheme(color)
                                            window.localStorage.setItem("theme", color)
                                        }}
                                    />
                                })}
                            </div>
                            <div className="title">选择布局样式</div>
                            <div className="content">
                                    
                            </div>
                        </div>
                    </div>
                    <div className="user">
                        <Avatar className="user-avatar" src={<img src={require("@/assets/image/anya.png")} />} />
                        <span className="user-name">{userName}</span>
                        <DownOutlined className="user-arrow"/>
                    </div>
                </div>
                <Background color={theme}/>
            </div>
            {/** 菜单+内容区域 */}
            <div className='content-box'>
                <Menu />
                <div className="content">
                    <div className="breadcrumb">
                        <Breadcrumb
                            separator=">"
                            items={breadcrumbItems}
                        />
                    </div>
                    <div className="container">
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
        </div>
    </ConfigProvider>
}

export default Layout;