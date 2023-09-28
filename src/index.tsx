import React from 'react';
import ReactDOM from 'react-dom/client';
import { AliveScope } from 'react-activation';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import { request } from '@/axios'

import './mock'

import './index.less';
import 'antd/dist/reset.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// React.$request = request

root.render(
    <Provider store={store}>
        <AliveScope>
            <App />
        </AliveScope>
    </Provider>
);
