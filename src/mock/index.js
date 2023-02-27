import Mock from "mockjs";

Mock.mock(/\/mock\/getBondMemberList*?/, 'get', ({ body }) => {
    const request = JSON.parse(body)
    return { 
        code: 200,
        data: {
            page: {
                current: request.current,
                pageSize: request.pageSize,
                total: 4
            },
            list: require('./json/bondMemberList.json')
        }, 
        success: true,
        msg: "操作成功" 
    }
})