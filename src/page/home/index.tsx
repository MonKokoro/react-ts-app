import React, { useState, useEffect, useRef } from 'react';
import './index.less'

function Home() {
    return <div className="home">
        <div className="title">
            欢迎回来！<span className='mark'>{window.localStorage.getItem("userName")}</span>~
        </div>
        <div className='row'>
            
        </div>
    </div>
}

export default Home;
