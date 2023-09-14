/** 页面跳转hook */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import store from "@/store";
import { addPage, removePage } from '@/store/pageList'
import { routerMap } from "@/router";

export default function usePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    
    const [ layout, setLayout ] = useState<string>(window.localStorage.getItem("layout") || "single")
    
    useEffect(() => {
        setLayout(window.localStorage.getItem("layout") || "single")
    }, [window.localStorage.getItem("layout")])

    /** 页面跳转方法 */
    function jumpTo(obj: jumpToObject | string){
        let url = ''
        let label = ''
        let param = {}
        if(obj instanceof Object){
            url = obj.url
            label = obj.label || (routerMap[obj.url] ? routerMap[obj.url][1] : '')
            param = obj.param || {}
        }
        else{
            url = obj
            label = routerMap[obj] ? routerMap[obj][1] : ''
        }
        navigate(url)
        if(layout === "multiple"){
            dispatch(addPage({
                key: url,
                label
            }))
        }
    }

    /** 页面关闭方法 */
    function closePage(url: string){
        removePage(url.replace('/', ''))
    }

    return { jumpTo, closePage }
}

export type jumpToObject = {
    url: string,
    label?: string,
    param?: any
}