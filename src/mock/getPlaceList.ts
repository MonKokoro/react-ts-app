import Mock from "mockjs";

export default Mock.mock(/\/mock\/getPlaceList*?/, 'get', ({ body }) => {
    const request = JSON.parse(body)
    return { 
        code: 200,
        data: [
            { value: "bond", desc: "结束乐队" }
        ], 
        success: true,
        msg: "操作成功" 
    }
})