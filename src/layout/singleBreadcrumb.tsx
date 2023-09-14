/** 页头面包屑 - 单页模式 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumb } from 'antd'
import store from "@/store";
import { routerMap, routeList, breadcrumbMap } from "@/router";

function SingleBreadcrumb() {
    const navigate = useNavigate()
    const [ breadcrumbItems, setBreadcrumbItems ] = useState<any>([])

    useEffect(() => {
        const pathname = location.pathname.replace('/', '')
        let result = [{title: "首页"}]
        if(breadcrumbMap[pathname]){
            result = breadcrumbMap[pathname].reduce((prev: any, curr: any) => {
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
        else{
            result = [{title: routerMap[pathname] ? routerMap[pathname][1] : "首页"}]
        }
        setBreadcrumbItems(result)

    }, [location.pathname])

    return <div className="single-breadcrumb">
        <Breadcrumb
            separator=">"
            items={breadcrumbItems}
        />
    </div>
}

export default SingleBreadcrumb;