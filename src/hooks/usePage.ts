/** 页面跳转hook */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import store from "@/store";
import { addPage, removePage, setPages } from '@/store/pageList'
import { routerMap, specialRouteMap } from "@/router";

export default function usePage() {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    
    const [ layout, setLayout ] = useState<string>(window.localStorage.getItem("layout") || "single")
    
    useEffect(() => {
        setLayout(window.localStorage.getItem("layout") || "single")
    }, [window.localStorage.getItem("layout")])

    /** 将url与参数组装成字符串 */
    function toUrl(url: string, param: object){
        if(param !== {}){
            let result = `${url}?`
            for(let key in param){
                result += `${key}=${param[key]}&`
            }
            result = result.substring(0, result.length-1)
            return result
        }
        return url
    }

    /** 将search字符串转换为对象 */
    function searchToJson(search: string){
        let result = {}
        if(result){
            const searchParams = new URLSearchParams(search)
            const params: any = searchParams.entries()
            for(let item of params){
                result[item[0]] = item[1]
            }
            // const searchStrs = search.substring(1, search.length).split('&')
            // result = searchStrs.reduce((prev, curr) => {
            //     const paramItem = curr.split('=')
            //     prev[paramItem[0]] = paramItem[1]
            //     return prev
            // }, {})
        }
        return result
    }

    /** 
     * 页面跳转方法 
     * url请在开头加上/，举例：/modern-table
     * 需要传参的情景，请使用param参数，或者使用?接在url后面
    */
    function openPage(obj: openPageObject | string){
        const pageList = store.getState().pageList
        let url = ''
        let label = ''
        let param = {}
        if(obj instanceof Object){
            url = obj.url
            label = obj.label || (routerMap[obj.url.replace('/', '')] ? routerMap[obj.url.replace('/', '')][1] : '')
            param = obj.param || {}
        }
        else{
            url = obj
            label = routerMap[obj.replace('/', '')] ? routerMap[obj.replace('/', '')][1] : ''
        }
        
        navigate(toUrl(url, param))

        /**
         * 多标签模式下，如果标签上不存在需要打开的页面，则添加标签
         * 如果需要打开的页面允许打开多个：根据保存的param判断是否已被打开，不存在则添加
         */
        if(layout === "multiple"){
            if(specialRouteMap[url.replace('/', '')] ?.multiple){
                if(!pageList.some(record => record.key === toUrl(url, param)))
                    return dispatch(addPage({
                        key: toUrl(url, param),
                        routeKey: url.replace('/', ''),
                        param,
                        label
                    }))
            }
            else{
                if(!pageList.some(record => record.routeKey === url.replace('/', '')))
                    return dispatch(addPage({
                        key: url,
                        routeKey: url.replace('/', ''),
                        param,
                        label
                    }))
            }
        }
    }

    /** 页面关闭方法 */
    function closePage(url: string){
        removePage(url.replace('/', ''))
    }

    /** 仅保留当前页 */
    function reservePage(obj: openPageObject | string){
        const pageList = store.getState().pageList
        let key = obj instanceof Object ? toUrl(obj.url, obj.param) : obj
        return dispatch(
            setPages(pageList.filter(item => item.routeKey === 'home' || item.key === key))
        )
    }

    /** 获取当前路由下的param */
    function getParam():any{
        return searchToJson(window.location.search)
    }

    return { openPage, closePage, reservePage, searchToJson, getParam }
}

export type openPageObject = {
    url: string,
    label?: string,
    param?: any
}