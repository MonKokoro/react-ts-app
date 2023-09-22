import React, { useState, useEffect, useRef } from 'react';
import { NotificationTwoTone, CarTwoTone } from '@ant-design/icons';
import dayjs from 'dayjs'
import ChartCard from "./chart-card"
import MessageCard from "./message-card"
import lib from "@/lib"
import './index.less'

import * as echarts from 'echarts/core';

function Home() {
    const [ time, setTime ] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(dayjs());
        }, 1000);
    
        return () => clearInterval(interval);
    }, []);

    /** 监听浏览器大小变化 */
    useEffect(() => {
        window.addEventListener(`resize`, lib.throttle(resizeUpdate, 100));
        return () => {
            window.removeEventListener(`resize`, lib.throttle(resizeUpdate, 100));
        }
    }, [])

    /** 发生变化时，告知ChartCard组件需要重渲染 */
    function resizeUpdate(e: Event){
        const chart = echarts.getInstanceByDom(document.getElementById('chartKey'));
        chart && chart.resize()
    }

    return <div className="home">
        <div className='row'>
            <div className="title hover-box">
                欢迎回来！<span className='mark'>{window.localStorage.getItem("userName")}</span>~ 今天过得如何？
            </div>
            <div className='title-card-box'>
                <div className='title-card hover-box'>
                    <div className='title-card-left'>
                        <NotificationTwoTone style={{ fontSize: 32 }}/>
                    </div>
                    <div className='title-card-right'>
                        <div className='title-card-right-title'>等待处理</div>
                        <div className='title-card-right-number'>10</div>
                    </div>
                </div>
                <div className='title-card hover-box'>
                    <div className='title-card-left'>
                        <CarTwoTone style={{ fontSize: 32 }}/>
                    </div>
                    <div className='title-card-right'>
                        <div className='title-card-right-title'>访问量</div>
                        <div className='title-card-right-number'>20</div>
                    </div>
                </div>
            </div>
        </div>
        <div className='row'>
            <div className="row-box clock-box hover-box">
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
            <div className="row-box chart-box hover-box">
                <ChartCard
                    title="图表测试"
                    url="/mock/getVisitList" 
                    chartKey="chartKey" 
                    lineDesc={{
                        visitsList: "访问量"
                    }}
                />
            </div>
        </div>
        <div className='row'>
            <div className="row-box message-box hover-box">
                <MessageCard />
            </div>
        </div>
    </div>
}

export default Home;
