/**  内容卡片组件 - 全局可用的展示区样式组件 */

import React, { useState, useRef } from 'react';
import './index.less'

function ContentCard({
    title,
    tip,
    rightRender,
    children
}: ContentCardProps) {
    return <div className="content-card">
        <div className="card-top">
            <div className="title">
                <div className="title-text">{title}</div>
                {tip && <div className="title-tip">
                    {tip}
                </div>}
                <div className="title-right">
                    {rightRender && rightRender}
                </div>
            </div>
        </div>
        <div className="card-context">
            {children}
        </div>
    </div>
}

export type ContentCardProps = {
    title: string,
    tip?: string,
    rightRender?: string | React.ReactNode,
    children?: string | React.ReactNode
}
export default ContentCard;