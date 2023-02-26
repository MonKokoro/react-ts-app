import Mock from "mockjs";

function structuring(jsonUrl){
    return {
        code: 200,
        data: require(jsonUrl),
        msg: "操作成功"
    }
}

export default Mock.mock('/getDataList', 'GET', structuring('./json/bondMemberList.json'))