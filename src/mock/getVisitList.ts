/** 工作台 - 获取访问量 */
import Mock from "mockjs";
import dayjs from "dayjs";

export default Mock.mock(/\/mock\/getVisitList*?/, 'get', ({ body }) => {
    const request = JSON.parse(body)
    console.log(request)
    const countMap = {
        0: 3,
        1: 6,
        2: 12
    }
    let monthList = []
    let visitsList = []
    for(let i = 0; i < countMap[request.scope]; i++){
        monthList.push(dayjs().add(-countMap[request.scope] + i + 1, 'month').month() + 1)
        visitsList.push((Math.random()*100).toFixed(0))
    }
    return { 
        code: 200,
        data: {
            monthList,
            visitsList
        }, 
        success: true,
        msg: "操作成功" 
    }
})