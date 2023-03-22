import React, { useState, useEffect, Fragment } from "react"
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { DownOutlined, ForwardOutlined, BackwardOutlined, HomeOutlined, BarsOutlined } from '@ant-design/icons';
import './menu.less'

import store from "./store";
import { resetMask } from './store/needMaskCount'

// interface MenuItem {
//     iconUrl: string
//     name: string
//     url: string,
//     children?: SubMenuItem[]
// }

// interface SubMenuItem {
//     name: string
//     url: string
// }

function SysMenu() {
    const location = useLocation()

    const [ menuList, setMenuList ] = useState<any>([])
    // const [ focusMenuUrl, setFocusMenuUrl ] = useState<string>()
    // const [ expandMenuMap, setExpandMenuMap ] = useState<any>({})
    const [ collapsed, setCollapsed ]  = useState<boolean>(false)
    const [ focus, setFocus ] = useState<string>()

    useEffect(() => {
        setMenuList([
            {
                label: <Link to="/home">首页</Link>,
                key: "/home",
                icon: <HomeOutlined />
            },
            {
                label: "组件案例&API",
                key: "",
                icon: <BarsOutlined />,
                children: [
                    {
                        label: <Link to="/modern-table-test">ModernTable</Link>,
                        key: "/modern-table-test"
                    }
                ]
            },
            // {
            //     iconUrl: "",
            //     label: "canvas练习",
            //     key: "/canvas-practise"
            // }
        ])
    }, [])

    useEffect(() => {
        if(location.pathname == '/')
            setFocus('/home')
        else
            setFocus(location.pathname)
    }, [location])
    
    /**
     * Q：为什么要特意给盒子加固定宽度，不使用自适应布局？
     * A：因为菜单展开收起的动画效果。如果使用自适应布局，在transition执行时相当于浏览器每一帧都在计算盒子的宽度进行绘制，会产生非常明显的卡顿。赋予了固定宽度后则不需要进行多余的计算，只是些许降低了可塑性。作为一个web页面，这样的代价时可以接受的
     */
    return <div className={`menu-box ${collapsed ? "menu-box-collapsed" : ""}`}>
        <div className="logo">{collapsed ? "--" : "MonShin花园"}</div>
        <div className='menu'>
            <Menu
                className={`menu-body ${!collapsed ? "menu-body-collapsed" : ""}`}
                mode="inline"
                items={menuList || []}
                selectedKeys={[focus]}
                inlineCollapsed={collapsed}
            />
            <div className='menu-collapsed-icon' onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <ForwardOutlined className='menu-collapsed' /> : <BackwardOutlined className='menu-collapsed' />}
            </div>
        </div>
    </div>

    // 考虑到主要面向B端，自己设计的菜单过于花里胡哨了，暂时废弃
    // return <div className='menu'>
    //     {menuList.map(item => {
    //         if(!item.children){
    //             const focus = focusMenuUrl === item.url
    //             return <Link to={item.url} key={item.url}>
    //                 <div className={`menu-item ${focus ? "menu-item-focus" : "menu-item-unfocus"}`}>
    //                     <div className="icon"></div>
    //                     <div className="label">{item.name}</div>
    //                 </div>
    //             </Link>
    //         }
                
    //         else{
    //             const expand = expandMenuMap[item.url]
    //             return <Fragment key={item.name}>
    //                 <div 
    //                     className={`menu-item menu-item-unfocus`}
    //                     onClick={() => {
    //                         setExpandMenuMap({
    //                             ...expandMenuMap,
    //                             [item.url]: !expandMenuMap[item.url]
    //                         })
    //                     }}
    //                     key={item.name}
    //                 >
    //                     <div className="icon"></div>
    //                     <div className="label-expandable">{item.name}</div>
    //                     <div className={`arrow ${expand ? "arrow-expand" : ""}`}><DownOutlined /></div>
    //                 </div>
    //                 <div className={`sub-menu ${expand ? "sub-menu-close" : ""}`}>
    //                     {item.children.map(subItem => {
    //                         const focus = focusMenuUrl === subItem.url
    //                         // 切换路由时，重置蒙版计数状态
    //                         return <Link to={subItem.url} key={subItem.url} onClick={() => store.dispatch(resetMask())}>
    //                             <div 
    //                                 className={`menu-item sub-menu-item ${focus ? "menu-item-focus" : "menu-item-unfocus"} ${expand ? "sub-menu-item-close" : ""}`}
    //                             >
    //                                 <div className="label">{subItem.name}</div>
    //                             </div>
    //                         </Link>
    //                     })}
    //                 </div>
    //             </Fragment>
    //         }
    //     })}
    // </div>
}

export default SysMenu;