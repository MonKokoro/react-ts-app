import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from 'antd';
import lib from '@/lib';

function MessageCard() {
    const [ messageList, setMessageList ] = useState<any[]>([])

    useEffect(() => {
        getMessageList()
    }, [])

    /** 获取消息列表 */
    function getMessageList(){
        lib.request({
            url: "/mock/getMessageList",
            method: "GET",
            success: (res: any[]) => {
                setMessageList(res)
            }
        })
    }

    return <div className="message-card">
        <div className='card-title'>
            <div className='title-left'>我的消息</div>
            <div className='title-right'>筛选</div>
        </div>
        <div className='card-content'>
            <div className='message-list'>
                {messageList.map(item => {
                    return <div className='message-list-item' key={item.id}>
                        <div className='item-head'>
                            <Avatar className="user-avatar" src={<img src={require("@/assets/image/anya.png")} />} />
                        </div>
                        <div className='item-content'>
                            <div className='item-content-name'>{item.createName}</div>
                            <div className='item-content-text'>{item.content}</div>
                        </div>
                        <div className='item-right'>
                            <span className='link'>操作</span>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default MessageCard;