import React, { useState, useRef } from 'react';
import { Card, Alert, message, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import './index.less'

import HoverButton from '@/component/hover-button';
import Loading from '@/component/loading'

const { Meta } = Card;

function AnimateCompDemo() {
    return <div className="animate-comp-demo main-page">
        <Alert style={{marginBottom: 12}} message="一些视觉效果不错的控件~" type="success" />
        <Row gutter={16}>
            <Col span={8}>
                <Card
                    // hoverable
                    cover={<div className='component-demo-box'>
                        <HoverButton onClick={() => message.success("成功触发点击√")}>Hover Button</HoverButton>
                        <HoverButton 
                            onClick={() => message.success("成功触发点击√")}
                            icon={<SettingOutlined />}
                        >Hover Button</HoverButton>
                    </div>}
                >
                    <Meta title="HoverButton控件" description="支持全局换肤的配置，支持自定义图标" />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    // hoverable
                    cover={<div className='component-demo-box'>
                        <Loading />
                    </div>}
                >
                    <Meta title="Loading动画" description="将6个div组装成一个立方体进行旋转，挺有意思的" />
                </Card>
            </Col>
        </Row>
        
    </div>
}

export default AnimateCompDemo;