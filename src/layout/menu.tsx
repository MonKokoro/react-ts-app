import React, { useState, useEffect, Fragment } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu } from 'antd';
import { DragOutlined, ForwardOutlined, BackwardOutlined, HomeOutlined, BarsOutlined, UnorderedListOutlined } from '@ant-design/icons';
// import './menu.less'
import lib from '@/lib'
import axios from '@/axios'

import store from "@/store";
import { collapsedSet } from '@/store/collapsed'
// import { addPage } from '@/store/pageList'
import { routerMap, routeList, breadcrumbMap } from "@/router";
import { iconJson } from "@/common/iconMap"
import { usePage } from "@/hooks"

function SysMenu({ menuList }: SysMenuProps) {
    // const navigate = useNavigate()
    const location = useLocation()
    const page = usePage()
    const dispatch = useDispatch();

    const [ list, setList ] = useState<any>([])
    const [ collapsed, setCollapsed ]  = useState<boolean>(false)
    const [ focus, setFocus ] = useState<string>()

    store.subscribe(() => {
        setCollapsed(store.getState().collapsed)
    })

    useEffect(() => {
        setList(menuList.reduce((prev: any[], curr: any) => {
            if(curr.children?.length){
                prev.push({
                    label: curr.name,
                    key: curr.name,
                    icon: iconJson[curr.icon] || '',
                    children: curr.children.reduce((pre: any[], cur: any) => {
                        pre.push({
                            label: <div
                                onClick={() => {
                                    page.openPage(`/${cur.url}`)
                                    // navigate(`/${cur.url}`)
                                    // dispatch(addPage({
                                    //     key: cur.url,
                                    //     label: routerMap[cur.url][1]
                                    // }))
                                }}
                            >{cur.name}</div>,
                            key: cur.url
                        })
                        return pre
                    }, [])
                })
            }
            else{
                prev.push({
                    label: <div
                        onClick={() => {
                            // navigate(`/${curr.url}`)
                            // dispatch(addPage({
                            //     key: curr.url,
                            //     label: routerMap[curr.url][1]
                            // }))
                            page.openPage(`/${curr.url}`)
                        }}
                    >{curr.name}</div>,
                    key: curr.url,
                    icon: iconJson[curr.icon] || ''
                })
            }

            return prev
        }, []))
    }, [menuList])

    /** 监听浏览器大小变化 */
    useEffect(() => {
        window.addEventListener(`resize`, lib.throttle(changeCollapsed, 100));
        return () => {
            window.removeEventListener(`resize`, lib.throttle(changeCollapsed, 100));
        }
    }, [])

    useEffect(() => {
        const pathname = location.pathname.replace('/', '') || 'home'
        setFocus(pathname)
    }, [location])

    /** 改变菜单收缩状态 */
    function changeCollapsed(e: any){
        if(e.currentTarget.innerWidth < 780){
            dispatch(collapsedSet(true));
        }
        else{
            dispatch(collapsedSet(false));
        }
    }
    
    /**
     * Q：为什么要特意给盒子加固定宽度，不使用自适应布局？
     * A：因为菜单展开收起的动画效果。如果使用自适应布局，在transition执行时相当于浏览器每一帧都在计算盒子的宽度进行绘制，会产生非常明显的卡顿。赋予了固定宽度后则不需要进行多余的计算，只是些许降低了可塑性。作为一个web页面，这样的代价是可以接受的
     */
    return <div className={`menu-box ${collapsed ? "menu-box-collapsed" : ""}`}>
        <div className='menu'>
            <Menu
                className={`menu-body ${!collapsed ? "menu-body-collapsed" : ""}`}
                mode="inline"
                items={list || []}
                selectedKeys={[focus]}
                inlineCollapsed={collapsed}
                theme="dark"
            />
            <div className='menu-collapsed-icon' onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <ForwardOutlined className='menu-collapsed' /> : <BackwardOutlined className='menu-collapsed'/>}
            </div>
        </div>
    </div>
}

export type SysMenuProps = {
    menuList: {
        label: string,
        key: string,
        icon?: string,
        children?: {
            label: string,
            key: string
        }[]
    }[]
}
export default SysMenu;