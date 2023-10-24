import React, { useState, useRef } from 'react';
import { usePage } from '@/hooks'
import ContentCard from '@/component/content-card'
// import './index.less'

function ModernTableTestDetail() {
    const page = usePage()
    const param = page.getParam()
    return <div className="modern-table-test-detail main-page">
        <ContentCard title='基本信息'>
            <div className="text-green-400">{param?.id}测试</div>
        </ContentCard>
        
    </div>
}

export default ModernTableTestDetail;