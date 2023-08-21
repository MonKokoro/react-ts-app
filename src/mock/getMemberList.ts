import Mock from "mockjs";

export default Mock.mock(/\/mock\/getMemberList*?/, 'get', ({ body }) => {
    return { 
        code: 200,
        data: [
            {
                "name": "後藤ひとり",
                "chineseName": "后藤一里",
                "age": 15,
                "cv": "青山吉能",
                "responsibility": "guitarist"
            },
            {
                "name": "いじちにじか",
                "chineseName": "伊地知虹夏",
                "age": 18,
                "cv": "铃代纱弓",
                "responsibility": "drummer"
            },
            {
                "name": "きたいくよ",
                "chineseName": "喜多郁代",
                "age": 15,
                "cv": "长谷川育美",
                "responsibility": "leadSinger"
            },
            {
                "name": "山田リョウ",
                "chineseName": "山田凉",
                "age": 18,
                "cv": "水野朔",
                "responsibility": "bassist"
            }
        ], 
        success: true,
        msg: "操作成功" 
    }
})