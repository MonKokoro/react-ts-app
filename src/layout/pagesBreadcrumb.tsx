/** 页头面包屑 - 多标签模式 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAliveController } from 'react-activation'
import { Tabs } from 'antd'
import store from "@/store";
import { useDispatch } from 'react-redux';
import { addPage, removePage } from '@/store/pageList'
import { routerMap } from "@/router";

function PagesBreadcrumb() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { drop } = useAliveController()
    const [ activeKey, setActiveKey ] = useState<string>()
    const [ pageList, setPageList ] = useState([])

    useEffect(() => {
        const pathname = location.pathname.replace('/', '') || 'home'
        if(routerMap[pathname]){
            dispatch(addPage({
                key: pathname,
                label: routerMap[pathname][1]
            }))
        }
    }, [])

    useEffect(() => {
        const pathname = location.pathname.replace('/', '')
        setActiveKey(pathname)
    }, [location.pathname])

    store.subscribe(() => {
        setPageList(store.getState().pageList)
    })

    return <div className="pages-breadcrumb">
        <Tabs
            type="editable-card"
            hideAdd={true}
            activeKey={activeKey}
            tabPosition={'top'}
            items={pageList}
            onChange={(key) => {
                navigate(`/${key}`)
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
                        navigate(`/${pageList[nextIndex].key}`)
                    }
                }
            }}
        />
    </div>
}

export default PagesBreadcrumb;