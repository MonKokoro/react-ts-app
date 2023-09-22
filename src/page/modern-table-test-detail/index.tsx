import React, { useState, useRef } from 'react';
import { usePage } from '@/hooks'
// import './index.less'

function ModernTableTestDetail() {
    const page = usePage()
    const param = page.getParam()
    return <div className="modern-table-test-detail main-page">
        {param?.id}测试
    </div>
}

export default ModernTableTestDetail;