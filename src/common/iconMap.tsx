/** 图标控制 */

import React from 'react';
import { 
    HomeOutlined,
    BarsOutlined,
    UnorderedListOutlined,
    DragOutlined,
    DesktopOutlined, 
    UserOutlined, 
    SolutionOutlined, 
    ContainerOutlined, 
    CreditCardOutlined, 
    AlertOutlined, 
    SettingOutlined,
    AuditOutlined,
    BookOutlined,
    AreaChartOutlined,
    ThunderboltOutlined,
    PayCircleOutlined,
    BulbOutlined,
    ApartmentOutlined,
    GlobalOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';
import { Space } from 'antd';

const iconJson: any = {
    HomeOutlined: <HomeOutlined />,
    BarsOutlined: <BarsOutlined />,
    UnorderedListOutlined: <UnorderedListOutlined />,
    DragOutlined: <DragOutlined />,
    DesktopOutlined: <DesktopOutlined />,
    UserOutlined: <UserOutlined />,
    SolutionOutlined: <SolutionOutlined />,  
    ContainerOutlined: <ContainerOutlined />,
    CreditCardOutlined: <CreditCardOutlined />,
    AlertOutlined: <AlertOutlined />,
    SettingOutlined: <SettingOutlined />,
    AuditOutlined: <AuditOutlined />,
    BookOutlined: <BookOutlined />,
    AreaChartOutlined: <AreaChartOutlined />,
    ThunderboltOutlined: <ThunderboltOutlined />,
    PayCircleOutlined: <PayCircleOutlined />,
    BulbOutlined: <BulbOutlined />,
    ApartmentOutlined: <ApartmentOutlined />,
    GlobalOutlined: <GlobalOutlined />,
    FieldTimeOutlined: <FieldTimeOutlined />
}

let iconOptionsList: { id: string, name: any }[] = []
for(let key in iconJson){
    iconOptionsList.push({
        id: key, 
        name: <Space>
            {iconJson[key]}
            {key}
        </Space>
    })
}

export { iconJson, iconOptionsList }