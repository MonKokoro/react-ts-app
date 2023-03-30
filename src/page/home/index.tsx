import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs'
import './index.less'

function Home() {
    const [ time, setTime ] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(dayjs());
        }, 1000);
    
        return () => clearInterval(interval);
    }, []);

    return <div className="home">
        <div className="title">
            欢迎回来！<span className='mark'>{window.localStorage.getItem("userName")}</span>~
        </div>
        <div className='row'>
            <div className="row-box clock-box">
                <div className="clock-component">
                    <div className="clock">
                        <div className="center" />
                        <div className="hand hour-hand" style={{ transform: `rotate(${time.hour() * 30 - 90}deg)` }} />
                        <div className="hand minute-hand" style={{ transform: `rotate(${time.minute() * 6 - 90}deg)` }} />
                        <div className="hand second-hand" style={{ transform: `rotate(${time.second() * 6 - 90}deg)`}} />
                    </div>
                </div>
                <div className="clock-text">
                    <div className="desc">当前时间</div>
                    <div className="value">{time.format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
            </div>
            <div className="row-box">
                测试
            </div>
        </div>
    </div>
}

export default Home;
