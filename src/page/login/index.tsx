import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import throttle from 'lodash/throttle'
import './index.less'

function Login() {
    const navigate = useNavigate();
    const userNameRef = useRef<string>()
    const passwordRef = useRef<string>()
    const [ mode, setMode ] = useState<"horizonal" | "vertical">("horizonal")
    const [ userNameWarn, setUserNameWarn ] = useState<boolean>(false)
    const [ passwordWarn, setPasswordWarn ] = useState<boolean>(false)

    /** 监听浏览器大小变化 */
    useEffect(() => {
        if(window.outerWidth < 900){
            setMode("vertical")
        }
        window.addEventListener(`resize`, throttle(modeChanger, 100));
        return () => {
            window.removeEventListener(`resize`, throttle(modeChanger, 100));
        }
    }, [])

    /** 发生变化时，重新判断是否切换为竖屏模式 */
    function modeChanger(e: any){
        if(e.target.outerWidth < 900){
            setMode("vertical")
        }
        else{
            setMode("horizonal")
        }
    }

    function login(){
        let failFlag = false

        if(!userNameRef.current){
            setUserNameWarn(true)
            failFlag = true
        }
        if(!passwordRef.current){
            setPasswordWarn(true)
            failFlag = true
        }

        if(failFlag)
            return
        else{
            window.localStorage.setItem('userName', userNameRef.current)
            navigate('/home')
        }
    }

    return <div className="login">
        <div className={`circle ${mode == "vertical" ? 'circle-ventical' : ''}`} />
        <div className={`container ${mode == "vertical" ? 'container-center' : ''}`}>
            <div className="title">请先登录哦~</div>
            <div className={`input-field ${userNameWarn ? "input-field-warn" : ''}`}>
                <img src={require('@/assets/svg/user.svg')} />
                <input placeholder='用户名' autoComplete='off' onChange={(e) => {
                    userNameRef.current = e.target.value
                    setUserNameWarn(false)
                }}/>
            </div>
            <div className={`input-field ${passwordWarn ? "input-field-warn" : ''}`}>
                <img src={require('@/assets/svg/lock.svg')} />
                <input placeholder='密码' type="password" autoComplete='off' onChange={(e) => {
                    passwordRef.current = e.target.value
                    setPasswordWarn(false)
                }} />
            </div>
            <div className='button-field' onClick={() => login()}>登录</div>
            <div className="description-field">本系统由 MonShin保护协会 协力开发o(*￣▽￣*)ブ</div>
        </div>
    </div>
}

export default Login;
