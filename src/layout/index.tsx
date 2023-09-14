import React, { useState, useEffect } from "react"
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useAliveController } from 'react-activation'
import { ConfigProvider, Avatar, Spin } from 'antd';
import { SkinFilled, DownOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import './index.less'

import Menu from './menu'
import { routeList } from "@/router";
import store from "@/store";
// import Scrollbar from "@/component/scrollbar";
import axios from "@/axios";
import { clearPage } from '@/store/pageList'

import Background from "./background";
import SingleBreadcrumb from "./singleBreadcrumb";
import PagesBreadcrumb from "./pagesBreadcrumb";

function Layout () {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const currentOutlet = useOutlet()
    const aliveController = useAliveController()
    const [ userName, setUserName ] = useState<string>()
    const [ maskCount, setMaskCount ] = useState<number>(0)
    const [ theme, setTheme ] = useState<string>(window.localStorage.getItem("theme") || "#13547A")
    const [ layout, setLayout ] = useState<string>(window.localStorage.getItem("layout") || "single")
    const [ menuList, setMenuList ] = useState([])

    useEffect(() => {
        getMenuList()
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

    /** 路由ref */
    const { nodeRef } = routeList.find((route) => route.path === location.pathname) || {}

    /** 主题色 */
    const colorList = ["#13547A", "#1677FF", "#CE9C9D", "#ABD5BE", "#E0B394"]

    /** 获取菜单列表 */
    function getMenuList(){
        axios.request({
            url: "/mock/getMenuList",
            method: "GET"
        }).then( ({data}) => {
            setMenuList(data)
        })
    }

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
                        <SkinFilled className="skin-icon" color="white"/>
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
                                <div 
                                    className={`layout-box ${layout === 'single' ? 'layout-box-focus' : ''}`} 
                                    onClick={() => {
                                        setLayout("single")
                                        window.localStorage.setItem("layout", "single")
                                        /** 切换至单页应用时，清除现有的多标签列表和页面状态缓存 */
                                        dispatch(clearPage())
                                        aliveController.clear()
                                    }
                                }>单页应用</div>
                                <div 
                                    className={`layout-box ${layout === 'multiple' ? 'layout-box-focus' : ''}`} 
                                    onClick={() => {
                                        setLayout("multiple")
                                        window.localStorage.setItem("layout", "multiple")
                                    }
                                }>多标签应用</div>
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
                <Menu menuList={menuList}/>
                <div className="content">
                    <div style={{minHeight: 42}}>
                        {layout === "multiple" ? <PagesBreadcrumb /> : <SingleBreadcrumb />}
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
                                    // <div ref={nodeRef} className="content-side content-side-scrollbar">
                                    //     <Scrollbar style={{width: '100%', height: '100%'}}>
                                    //         {currentOutlet}
                                    //     </Scrollbar>
                                    // </div>
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