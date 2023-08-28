import Mock from "mockjs";

export default Mock.mock(/\/mock\/getMessageList*?/, 'get', ({ body }) => {
    return { 
        code: 200,
        data: [
            {
                "id": 1,
                "readed": false,
                "createName": "二次元教父虎哥",
                "content": "赵三金嗷，你果然是吉林跑男呐，拟态baby辣!这一大飞脚嗷，好悬没给我李宁踹开线了。你跟我玩阴滴嗷，记得没你好果汁，你跟我徒弟上上劲跟他跑嗷，来你跟他跑",
            },
            {
                "id": 2,
                "readed": false,
                "createName": "此乃檬心是也",
                "content": "很喜欢前端开发的一句话：啊？",
            },
            {
                "id": 3,
                "readed": true,
                "createName": "此乃檬心是也",
                "content": "如果你是龙，也好",
            }
        ], 
        success: true,
        msg: "操作成功" 
    }
})