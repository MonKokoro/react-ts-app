/** 页头面包屑 - 多标签模式 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAliveController } from 'react-activation'
import { Tabs, Dropdown } from 'antd'
import store from "@/store";
import { routerMap, specialRouteMap } from "@/router";
import { usePage } from "@/hooks"
import lib from '@/lib';

function PagesBreadcrumb() {
    const { refreshScope } = useAliveController()
    const location = useLocation()
    const page = usePage()
    const [ activeKey, setActiveKey ] = useState<string>()
    const [ pageList, setPageList ] = useState([])

    useEffect(() => {
        const pathname = location.pathname.replace('/', '')
        if(routerMap[pathname]){
            page.openPage({
                url: location.pathname,
                param: page.searchToJson(location.search)
            })
        }
        
        setPageList(store.getState().pageList.reduce((prev, curr) => {
            prev.push({
                ...curr,
                label: <>
                    <Dropdown 
                        menu={{
                            items: [
                                { label: "仅保留该页", key: "1", onClick: () => {
                                        page.reservePage(curr.key)
                                        setActiveKey(curr.key)
                                } },
                                { label: "刷新", key: "2", onClick: () => refreshScope(curr.routeKey) }
                            ],
                        }}
                        trigger={['contextMenu']}
                    >
                        <div>{curr.label}</div>
                    </Dropdown>
                </>
            })
            return prev
        }, []))
    }, [])

    useEffect(() => {
        console.log(location, pageList)
        setActiveKey(`${location.pathname}${location.search}`)
    }, [location.pathname])

    store.subscribe(() => {
        setPageList(store.getState().pageList.reduce((prev, curr) => {
            prev.push({
                ...curr,
                label: <>
                    <Dropdown 
                        menu={{
                            items: [
                                { label: "仅保留该页", key: "1", onClick: () => {
                                        page.reservePage(curr.key)
                                        setActiveKey(curr.key)
                                } },
                                { label: "刷新", key: "2", onClick: () => refreshScope(curr.routeKey) }
                            ],
                        }}
                        trigger={['contextMenu']}
                    >
                        <div>{curr.label}</div>
                    </Dropdown>
                </>
            })
            return prev
        }, []))
    })

    return <div className="pages-breadcrumb">
        {/** 设置min-width可用于避免容器被子元素撑开 */}
        {/** 因为min-width的优先级大于width和max-width，而弹性布局中min-width为auto，因此自然会被撑大 */}
        <div style={{width: "100%", minWidth: 0}}>
        {/* <div> */}
            <Tabs
                type="editable-card"
                hideAdd={true}
                activeKey={activeKey}
                tabPosition={'top'}
                items={pageList}
                onChange={(key) => {
                    const pageItem = pageList.find((item) => item.key === key)
                    page.openPage({
                        url: `/${pageItem.routeKey}`,
                        param: pageItem.param
                    })
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
                        page.closePage({
                            url: `/${targetPage.routeKey}`,
                            param: targetPage.param
                        })
                        // dispatch(removePage(targetPage))
                        // dropScope(targetPage.key)
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
                        }
                    }
                }}
            />
        </div>
    </div>
}

type PagesBreadcrumbProps = {
    tabsBoxWidth: number
}
export default PagesBreadcrumb;