import React, { useState, useEffect, Fragment } from "react"
import { Link, useLocation } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import './menu.less'

import store from "./store";
import { resetMask } from './store/needMaskCount'

interface MenuItem {
    iconUrl: string
    name: string
    url: string,
    children?: SubMenuItem[]
}

interface SubMenuItem {
    name: string
    url: string
}

function Menu() {
    const location = useLocation()

    const [ menuList, setMenuList ] = useState<MenuItem[]>([])
    const [ focusMenuUrl, setFocusMenuUrl ] = useState<string>()
    const [ expandMenuMap, setExpandMenuMap ] = useState<any>({})

    useEffect(() => {
        setMenuList([
            {
                iconUrl: "",
                name: "首页",
                url: "/home"
            },
            {
                iconUrl: "",
                name: "组件案例&API",
                url: "",
                children: [
                    {
                        name: "ModernTable",
                        url: "/modern-table-test"
                    }
                ]
            },
            {
                iconUrl: "",
                name: "canvas练习",
                url: "/canvas-practise"
            }
        ])
    }, [])

    useEffect(() => {
        if(location.pathname == '/')
            setFocusMenuUrl('/home')
        else
            setFocusMenuUrl(location.pathname)
    }, [location])
    
    return <div className='menu'>
        {menuList.map(item => {
            if(!item.children){
                const focus = focusMenuUrl === item.url
                return <Link to={item.url} key={item.url}>
                    <div className={`menu-item ${focus ? "menu-item-focus" : "menu-item-unfocus"}`}>
                        <div className="icon"></div>
                        <div className="label">{item.name}</div>
                    </div>
                </Link>
            }
                
            else{
                const expand = expandMenuMap[item.url]
                return <Fragment key={item.name}>
                    <div 
                        className={`menu-item menu-item-unfocus`}
                        onClick={() => {
                            setExpandMenuMap({
                                ...expandMenuMap,
                                [item.url]: !expandMenuMap[item.url]
                            })
                        }}
                        key={item.name}
                    >
                        <div className="icon"></div>
                        <div className="label-expandable">{item.name}</div>
                        <div className={`arrow ${expand ? "arrow-expand" : ""}`}><DownOutlined /></div>
                    </div>
                    <div className={`sub-menu ${expand ? "sub-menu-close" : ""}`}>
                        {item.children.map(subItem => {
                            const focus = focusMenuUrl === subItem.url
                            // 切换路由时，重置蒙版计数状态
                            return <Link to={subItem.url} key={subItem.url} onClick={() => store.dispatch(resetMask())}>
                                <div 
                                    className={`menu-item sub-menu-item ${focus ? "menu-item-focus" : "menu-item-unfocus"} ${expand ? "sub-menu-item-close" : ""}`}
                                >
                                    <div className="label">{subItem.name}</div>
                                </div>
                            </Link>
                        })}
                    </div>
                </Fragment>
            }
        })}
    </div>
}

export default Menu;