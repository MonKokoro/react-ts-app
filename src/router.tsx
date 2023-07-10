// routerMap应该是属于路由的语法糖，大幅缩减新建json时繁琐的key值，用简单的映射代替

/**
 * Q：为何routeList的属性中要加入nodeRef这个属性
 * A：因为本系统用到了路由切换动画，其作用原理是：在Layout组件中将路由对应的页面ref挂载到CSSTransition下，这样在路由更新时，ref也会随之更新，进而触发CSSTransition的动画系统
 * 
 * Q：为何要在路由文件中先使用createRef创建实例
 * A：也跟动画系统有关。由于本系统中切换页面时，存在切出动画，但路由的切换是立即完成的。如果在Layout组件中获取当前路由的实例，会导致上一个页面还未切出完毕，就已经被修改成了新页面，从而造成视觉上的bug
 * 
 * Q：createBrowserRouter和BrowserRouter有什么区别
 * A：createBrowserRouter是React Router v6.4的更新，其实无非是从写节点变成了写js，个人感觉是比以前的BrowserRouter好用一些。但这次更新说实话争议挺多的，因为塞了很多看起来用处不是很大的功能（比如说表单请求，将表单提交功能上升到路由级，但页面级足以应付极大多数情况），包体一下子大了很多，挺多人觉得这就是依托答辩……嘛，见仁见智吧，说不定哪一天这些新功能就派上用场了呢
*/

import React, { createRef } from "react"
import { createBrowserRouter } from 'react-router-dom';

import Login from "./page/login";
import Layout from "./layout";

import Home from "./page/home"
import ModernTableTest from "./page/modern-table-test";
import ModernFormTest from "./page/modern-form-test";
import Canvas from "./page/canvas"

/** 路由映射 */
const routerMap: any = {
    "home": [<Home/>, "首页"],
    "canvas-practise": [<Canvas />, "canvas"],
    "modern-table-test": [<ModernTableTest />, "ModernTable测试"],
    "modern-form-test": [<ModernFormTest />, "ModernForm测试"],
}

/** 面包屑映射，支持映射路由，也支持静态文本 */
const breadcrumbMap: any = {
    "modern-table-test": ["home"],
    "modern-form-test": ["home"]
}

let routeList: any[] = []
for( let pageTitle in routerMap ){
    routeList.push({
        path: `${pageTitle}`,
        element: routerMap[pageTitle][0],
        name: routerMap[pageTitle][1],
        nodeRef: createRef()
    })
}


const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    {
        path: '/',
        element: <Layout />,
        children: routeList.map((route) => ({
            index: route.path === '/',
            path: route.path === '/' ? undefined : route.path,
            element: route.element
        }))
    }
])

export { routerMap, routeList, breadcrumbMap }
export default router