import axios, { AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { env } from 'process'
// import store from "../store";

const baseURLMap = {
    dev: "http://192.168.5.17:8000",    //开发环境，进行本地联调时，修改本处ip即可
    test: "",                           //测试环境
    online: "https://",                 //线上
    owner: "http://127.0.0.1:8000"      //后端自测用本地环境
}

/** webpack5中process不再可全局使用，需要手动引入 */
const baseURL = baseURLMap[env.BUILD_ENV]

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.baseURL = baseURL
axios.defaults.timeout = 30000;
axios.defaults.headers['token'] = localStorage.getItem('token') || '';

const service = axios.create()

service.interceptors.request.use(
    config => {
        if(localStorage.getItem('token')){
            config.headers["token"] = localStorage.getItem('token')
        }
        return config
    },
    error => {
        if(error.message.includes('timeout')){
            message.error("请求超时")
        }

        if(process.env.BUILD_ENV !== "online"){
            console.warn(error)
        }

        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        /** 这里需要根据业务需求修改惹~ */
        switch(res.code){
            case 401:{
                message.error("登录失效，请重新登录")
                sessionStorage.clear()
                window.open(`/login`, "_self")
            }
        }
        return res
    },
    error => {
        if (error.message.includes('timeout')) {
			message.error("请求超时")
			return Promise.reject(error)
		}
        message.error(error.message)
        return Promise.reject(error)
    }
)

function request({ url, method = "POST", data, config = {} }: serviceProps){
    const serviceData = method === "POST" ? { data } : { param: data }
    return service<responseProps>({
        url,
        method,
        ...serviceData,
        ...config
    });
}

export { request }
export default service

interface responseProps {
    code: number,
    data?: any,
    msg?: string
}

interface serviceProps {
    url: string,
    method: "GET" | "POST",
    data: any,
    config?: AxiosRequestConfig
}