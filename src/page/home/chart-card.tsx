import React, { useState, useEffect } from "react"
import { Segmented } from 'antd'
import lib from "../../lib"
import './index.less'
import Loading from '@/component/loading'

import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent
]);

function ChartCard({ title, url, chartKey, lineDesc, color }: ChartCardProps){
    const [ segmentedValue, setSegmentedValue ] = useState<string | number>("近三月")
    const [ option, setOption ] = useState<any>()
    const [ loading, setLoading ] = useState(false)
    // const [ refresh, setRefresh ] = useState(0)

    useEffect(() => {
        getOptions()
    }, [segmentedValue]);

    useEffect(() => {
        if(option){
            if (document.getElementById(chartKey) == null)
                return
            echarts.dispose(document.getElementById(chartKey))
            const chart = echarts.init(document.getElementById(chartKey));
            chart.setOption(option);
        }
    }, [option])

    function getOptions(){
        const scopeMap = {
            "近三月": 0,
            "近半年": 1,
            "近一年": 2
        }
        setLoading(true)
        lib.request({
            url: url,
            method: "GET",
            data: { scope: scopeMap[segmentedValue] },
            success: (res: any) => {
                const xAxis = res.monthList
                let series = []
                let maxLength = 0
                for(let key in lineDesc){
                    series.push({
                        type: "line",
                        smooth: "true",
                        data: res[key],
                        name: lineDesc[key]
                    })
                    if(Math.max(...res[key]).toString().length > maxLength)
                        maxLength = Math.max(...res[key]).toString().length
                }
                const tooltip = {
                    trigger: 'axis',
                    backgroundColor: '#fff',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params: any) {
                        let formatterStr = ""
                        let count = 0
                        for(let key in lineDesc){
                            formatterStr += `<div style="color: #333333;">${lineDesc[key]}：${params[count].data}</div>`
                            count++
                        }
                        return formatterStr;
                    }
                }
                let option = {
                    legend: {
                        // orient: 'vertical',
                        right: "center",
                        top: 0
                    },
                    grid: {
                        left: `${20 + maxLength * 7}`,
                        // left: '15%',
                        right: '0',
                        top: '20',
                        bottom: '20',
                        ontainLabel: true
                    },
                    tooltip: tooltip,
                    xAxis: {
                        data: xAxis,
                    },
                    yAxis: { minInterval: 1 },
                    series: series
                }
                if(color){
                    option["color"] = color
                }
                setOption(option);
                setLoading(false)
            },
            fail: () => {
                setLoading(false)
            }
        })
    }

    return <div className='chart-card'>
        <div className='card-title'>
            <span className='card-title-text' title={title}>{title}</span>
            <div className='card-title-right'>
                <Segmented 
                    className='card-title-segmented' 
                    options={['近三月', '近半年', '近一年']} 
                    value={segmentedValue} 
                    onChange={(value) => setSegmentedValue(value)}
                />
            </div>
        </div>
        <div className='card-content'>
            <div id={chartKey} style={{width: "100%", height: 180}}></div>
        </div>
    </div>
}

export default ChartCard

interface ChartCardProps {
    title: string,
    url: string,
    chartKey: string,
    lineDesc: Object,
    color?: string
}