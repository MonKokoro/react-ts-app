import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { usePage } from '@/hooks';
import './index.less'

function ErrorPage() {
    const page = usePage()
    return <div className="error-page main-page">
        <div className='error-box'>
            <div className='error-content'>
                <div className='error-title'>出错啦！</div>
                <div className='error-desc'>页面没有找到哦...(PД`q。)麻烦检查一下路径对不对啦...</div>
                <div className='error-bottom'>
                    <Button type='primary' onClick={() => {
                        page.openPage('home')
                        page.closePage('home')
                    }}>返回首页</Button>
                </div>
            </div>
        </div>
        <div className='error-img'>
            这是一张图片
        </div>
    </div>
}

export default ErrorPage;