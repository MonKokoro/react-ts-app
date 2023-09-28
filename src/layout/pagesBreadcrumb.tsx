/** 页头面包屑 - 多标签模式 */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useAliveController } from 'react-activation'
import { Tabs, Button } from 'antd'
import store from "@/store";
import { useDispatch } from 'react-redux';
import { addPage, removePage } from '@/store/pageList'
import { routerMap, specialRouteMap } from "@/router";
import { usePage } from "@/hooks"
import lib from '@/lib';

function PagesBreadcrumb() {
    // const navigate = useNavigate()
    const tabsBoxRef = useRef<any>()
    const location = useLocation()
    const dispatch = useDispatch()
    const { drop } = useAliveController()
    const page = usePage()
    const [ activeKey, setActiveKey ] = useState<string>()
    const [ pageList, setPageList ] = useState([])
    const [ tabsBoxWidth, setTabsBoxWidth ] = useState(0)

    useEffect(() => {
        const pathname = location.pathname.replace('/', '') || 'home'
        if(routerMap[pathname]){
            page.openPage({
                url: location.pathname,
                param: page.searchToJson(location.search)
            })
            // dispatch(addPage({
            //     key: pathname,
            //     label: routerMap[pathname][1]
            // }))
        }
    }, [])

    /** 监听浏览器大小变化 */
    useEffect(() => {
        window.addEventListener(`resize`, lib.throttle(() => setTabsBoxWidth(tabsBoxRef.current.offsetWidth), 100));
        return () => {
            window.removeEventListener(`resize`, lib.throttle(() => setTabsBoxWidth(tabsBoxRef.current.offsetWidth), 100));
        }
    }, [])

    useEffect(() => {
        // console.log(location)
        // const pathname = location.pathname.replace('/', '')
        setActiveKey(`${location.pathname}${location.search}`)
    }, [location.pathname])

    store.subscribe(() => {
        setPageList(store.getState().pageList)
    })

    console.log(tabsBoxWidth)
    return <div className="pages-breadcrumb" ref={tabsBoxRef}>
        <div style={{width: tabsBoxWidth ? tabsBoxWidth - 120 : "auto"}}>
        {/* <div> */}
            <Tabs
                type="editable-card"
                hideAdd={true}
                activeKey={activeKey}
                tabPosition={'top'}
                items={pageList}
                // tabBarExtraContent={<Button 
                //     style={{marginRight: 8}} 
                //     size="small"
                //     onClick={() => {
                //         page.reservePage(`${location.pathname}${location.search}`)
                //     }}
                // >仅保留当前页</Button>}
                onChange={(key) => {
                    const pageItem = pageList.find((item) => item.key === key)
                    page.openPage({
                        url: `/${pageItem.routeKey}`,
                        param: pageItem.param
                    })
                    // navigate(`/${key}`)
                    setActiveKey(key)
                }}
                onEdit={(targetKey, action) => {
                    if(action === 'remove'){
                        let currentIndex = 0
                        const targetPage = pageList.find((record, index) => {
                            if(record.key === targetKey){
                                currentIndex = index
                                return true
                            }
                            return false
                        })
                        dispatch(removePage(targetPage))
                        drop(targetPage.key)
                        if(targetPage.key === activeKey){
                            let nextIndex = 0
                            if(pageList[currentIndex+1]){
                                nextIndex = currentIndex + 1
                            }
                            else{
                                nextIndex = currentIndex - 1
                            }
                            setActiveKey(pageList[nextIndex].key)
                            page.openPage({
                                url: `/${pageList[nextIndex].routeKey}`,
                                param: pageList[nextIndex].param
                            })
                            // navigate(`/${pageList[nextIndex].key}`)
                        }
                    }
                }}
            />
        </div>
        <div style={{width: 120}}>
            <Button 
                style={{margin: "0 8px"}} 
                size="small"
                onClick={() => {
                    page.reservePage(`${location.pathname}${location.search}`)
                }}
            >仅保留当前页</Button>
        </div>
    </div>
}

type PagesBreadcrumbProps = {
    tabsBoxWidth: number
}
export default PagesBreadcrumb;