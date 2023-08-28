/** 通用post接口，仅返回操作成功 */
import Mock from "mockjs";

export default Mock.mock(/\/mock\/commonTest*?/, 'post', ({ body }) => {
    return { 
        code: 200,
        success: true,
        msg: "操作成功" 
    }
})