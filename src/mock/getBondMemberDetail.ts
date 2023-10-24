/** 获取结束乐队成员详情 */
import Mock from "mockjs";

export default Mock.mock(/\/mock\/getBondMemberDetail*?/, 'get', ({ body }) => {
    return { 
        code: 200,
        success: true,
        msg: "操作成功" 
    }
})