import React from 'react';
import { Modal, message } from 'antd'
import store from "./store";
import axios from 'axios'

import { addMask, decreaseMask } from './store/needMaskCount'
import { themeMap } from './theme';

const { confirm } = Modal

type requestProps = {
    url: string,
    method?: "GET" | "POST",
    needMask?: boolean,
    showMsg?: boolean,
    data?: any,
    headers?: object,
    success: Function,
    fail?: Function,

    config?: object
}

type confirmModalProps = {
    content?: React.ReactNode | string,
    url: string,
    data?: any,
    method?: 'GET' | 'POST',
    success?: (res: any) => void
}

var lib = {
    config: {
        env: "online"
    },

    /** 获取url前缀 */
    getPrefixUrl (env: string) {
        let map = {
            dev: "http://192.168.5.17:8000",    //开发环境，如果要进行本地联调，修改这里的ip即可
            test: "",                    //测试环境
            online: "http://",                 //线上
            owner: "http://127.0.0.1:8000"      //后端自测用本地环境
        }
        return map[env] || lib.config.env
    },
    
    request({
        url,
        method = "POST",
        needMask = false,
        showMsg = false,
        data,
        headers = {},
        success = function () { },
        fail = function () { },

        config = {}
    }: requestProps){
        let prefixUrl = lib.getPrefixUrl("online")
        if (lib.config.env != "online") {
            prefixUrl = lib.getPrefixUrl(lib.config.env)
        }
        prefixUrl = ""
    
        const token = window.sessionStorage.getItem("token")

        needMask && store.dispatch(addMask())
    
        return axios.request({
            url: url,
            baseURL: prefixUrl,
            method,
            params: (method == "GET" ? Object.assign({ token }, data) : {}),
            data: Object.assign({ token }, data),
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                token,
                ...headers
            },
            ...config
        }).then(res => {
            let { status, data } = res;
            if (status == 200) {
                if (data.success) {
                    needMask && setTimeout(() => store.dispatch(decreaseMask()), 100)
                    success(data.data, res)
                    showMsg && message.success(data.msg);
                }
                else {
                    fail(res);
                    const errCode = res.data?.code
                    // if (errCode == 403) {
                    //     store.dispatch(setErrStatus(403))
                    // }
                    // else if(errCode == 500){
                    //     store.dispatch(setErrStatus(500))
                    // }
                    // else {
                    //     let errorModal = message.error({
                    //         title: "错误",
                    //         content: responseData.msg,
                    //         centered: true,
                    //         okText: "确认",
                    //         onOk () { errorModal.destroy() },
                    //     })
                    // }
                }
            }
            else {
                needMask && this.waitEnd(200);
                fail(res);
            }
        }).catch(err => {
            const { response: errResponse = {} } = err
            const { status: errStatus, data: errData = {} } = errResponse
            /** 优先读接口返回的状态码，如果没有则取axios自己的状态码 */
            // needMask && this.waitEnd(200);
            console.warn(err)
            needMask && store.dispatch(decreaseMask())
            if (err.code == "ERR_NETWORK" || err.code == "ECONNABORTED") {
                return message.error("网络连接异常")
            }
            if (errData.status || errStatus) {
                let text = err.message
                switch (errData.status || errStatus) {
                    case 401:
                        text = errData.message || errData.error || "登录失效，请重新登录"
                        window.sessionStorage.clear()
                        window.open(`#/login`, "_self")
                        break;
                    case 403:
                        text = errData.message || errData.error || "暂无权限"
                        // store.dispatch(setErrStatus(403))
                        break;
                    case 500:
                        text = errData.message || errData.error || "服务器内部错误"
                        // store.dispatch(setErrStatus(500))
                        break;
                    default:
                        fail(errResponse, err);
                }
                if(text){
                    message.destroy()
                    message.error(text)
                }
            }
            else {
                message.error("未知错误")
            }
        })
    },

    /** 弹窗确认简易方法，只支持简单情况，复杂情况不建议使用 */
    confirmModal ({
        content,
        url = "/",
        data = {},
        method = "POST",
        success = function () { }
    }: confirmModalProps) {
        let body = {}
        if(method == "POST"){
            body = {...data}
            data = {}
        }
        let confirmModal = confirm({
            title: "确认",
            content: content || "确定要执行操作吗？",
            centered: true,
            onOk () {
                lib.request({
                    url,
                    data,
                    method,
                    needMask: true,
                    showMsg: true,
                    success: (res: any) => {
                        success(res)
                        confirmModal.destroy()
                    },
                })
            },
            onCancel () { }
        })
    },

    /** 节流函数 */
    throttle (func: Function, wait: number) {
        let timeOut: any = null;
        return function () {
            let context = this;
            let args = arguments;
            if (!timeOut) {
                timeOut = setTimeout(function () {
                    func.apply(context, args);
                    timeOut = null;
                }, wait);
            }
        }
    },

    /** 快速获取主题色 */
    getThemeColor (theme?: string) {
        return themeMap[theme || store.getState().theme] || "#13547A"
    }
}

export default lib;