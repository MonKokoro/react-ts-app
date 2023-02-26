import axios from 'axios'

type requestProps = {
    url: string,
    method?: "GET" | "POST",
    needMask?: boolean,
    showMsg?: boolean,
    data?: any,
    headers?: object,
    success: Function,
    fail?: Function
}

function request({
    url,
    method = "POST",
    needMask = false,
    showMsg = false,
    data,
    headers = {},
    success = function () { },
    fail = function () { }
}: requestProps){
    let prefixUrl = lib.getPrefixUrl("online")
    if (lib.config.env != "online") {
        prefixUrl = lib.getPrefixUrl(lib.config.env)
    }

    const token = window.sessionStorage.getItem("token")

    return axios.request({
        url: url,
        baseURL: prefixUrl,
        method,
        params: (method == "GET" ? Object.assign(userData, data) : {}),
        data: Object.assign(userData, data),
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            token,
            ...headers
        },
        ...config
    }).then(res => {
        let { status, data: responseData, msg } = res;
        if (status == 200) {
            if (responseData.success) {
                needMask && this.waitEnd(200);
                needMask && store.dispatch(decrement())
                success(responseData.data, res)
                showMsg && message.success(responseData.msg);
            }
            else {
                fail(res);
                needMask && this.waitEnd(200);
                const errCode = res.data?.code
                if (errCode == 403) {
                    store.dispatch(setErrStatus(403))
                }
                // else if(errCode == 500){
                //     store.dispatch(setErrStatus(500))
                // }
                else {
                    let errorModal = error({
                        title: "错误",
                        content: responseData.msg,
                        centered: true,
                        okText: "确认",
                        onOk () { errorModal.destroy() },
                    })
                }
            }
        }
        else {
            needMask && this.waitEnd(200);
            fail(res);
        }
    }).catch(err => {
        /** 他们接口对报错的判断太乱了，感觉前端这边要同时处理接口本身报错、网关报错和axios报错三种 */
        const { response: errResponse = {} } = err
        const { status: errStatus, data: errData = {} } = errResponse
        /** 优先读接口返回的状态码，如果没有就取axios自己的状态码 */
        needMask && this.waitEnd(200);
        console.warn(err)
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
                    store.dispatch(setErrStatus(403))
                    break;
                case 500:
                    text = errData.message || errData.error || "服务器内部错误"
                    store.dispatch(setErrStatus(500))
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
}

var lib = {
    config: {
        env: "online"
    },

    /** 获取url前缀 */
    getPrefixUrl (env: "dev" | "test" | "online" | "owner") {
        let map = {
            //开发环境，如果要进行本地联调，修改这里的ip即可
            dev: "http://192.168.5.17:8000",
            //测试环境
            test: "http://",
            //线上
            online: "https://",
            //后端自测用本地环境
            owner: "http://127.0.0.1:8000"
        }
        return map[env] || lib.config.env
    },
    
    request: request,
}

export default lib;