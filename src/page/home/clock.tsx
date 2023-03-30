import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import './index.less'

function Clock() {
    const [ time, setTime ] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(dayjs());
        }, 1000);
    
        return () => clearInterval(interval);
    }, []);

    return <div className="clock">
        <div className="hand hour-hand" style={{ transform: `rotate(${time.hour() * 30 - 90}deg)` }} />
        <div className="hand minute-hand" style={{ transform: `rotate(${time.minute() * 6 - 90}deg)` }} />
        <div className="hand second-hand" style={{ transform: `rotate(${time.second() * 6 - 90}deg)`}} />
    </div>
}

export default Clock;
