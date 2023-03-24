import Mock, { Random } from "mockjs";

export default Mock.mock(/\/mock\/getBondMemberList*?/, 'get', ({ body }) => {
    const request = JSON.parse(body)
    let list = []
    Random.extend({
        member: function() {
            let members = [
                {
                    "name": "後藤ひとり",
                    "chineseName": "后藤一里",
                    "age": 15,
                    "cv": "青山吉能"
                },
                {
                    "name": "いじちにじか",
                    "chineseName": "伊地知虹夏",
                    "age": 18,
                    "cv": "铃代纱弓",
                },
                {
                    "name": "きたいくよ",
                    "chineseName": "喜多郁代",
                    "age": 15,
                    "cv": "长谷川育美",
                },
                {
                    "name": "山田リョウ",
                    "chineseName": "山田凉",
                    "age": 18,
                    "cv": "水野朔",
                }
            ]
            return this.pick(members)
        }
    })
    for(let i = 0; i < request.pageSize; i++){
        list.push({
            id: i + (request.current - 1) * 5,
            ...Random.member(),
            performanceExperience: [
                {
                    "id": 1,
                    "date": "2023-2-27",
                    "place": "演出厅",
                    "name": "xx公演"
                },
                {
                    "id": 2,
                    "date": "2023-3-27",
                    "place": "超大演出厅",
                    "name": "yy公演"
                }
            ]
        })
    }
    return { 
        code: 200,
        data: {
            page: {
                current: request.current,
                pageSize: request.pageSize,
                total: 25
            },
            list: list
        }, 
        success: true,
        msg: "操作成功" 
    }
})