import Mock from "mockjs";

export default Mock.mock(/\/mock\/getMenuList*?/, 'get', ({ body }) => {
    return { 
        code: 200,
        data: [
            {
                url: "home",
                name: "首页",
                icon: "HomeOutlined",
                children: []
            },
            {
                url: "",
                name: "组件案例",
                icon: "BarsOutlined",
                children: [
                    {url: "modern-table-test", name: "ModernTable"},
                    {url: "modern-form-test", name: "ModernForm"},
                    {url: "animate-comp-demo", name: "元素组件Demo"}
                ]
            },
            {
                url: "drag-test",
                name: "拖拽测试",
                icon: "DragOutlined",
                children: []
            },
            {
                url: "scrollbar-test",
                name: "滚动条测试",
                icon: "UnorderedListOutlined",
                children: []
            }
        ], 
        success: true,
        msg: "操作成功" 
    }
})