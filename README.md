# react-ts-app
基于React + Less + TypeScript + Ant Design搭建的后台管理系统模板

## 前言
该系统是以react+antd为基础开发的一套后台系统模板。除登录注销等基本功能外，还将分页查询、表单提交等常用重型功能组件化，使用简单轻便√<br/>并且依赖尽可能使用新版本，拥有新特性的同时易于版本控制，远离install版本问题烦恼...<br/>开发代码轻量，结构清晰，易于理解~（大概x）

## 特性
- 登录注销功能
- 动态获取菜单栏
- 自适应布局（目前还不支持竖屏.....）
- 搭配Ant Design的全局换肤功能
- 单页应用/多标签应用自由切换
- 舒适的动画效果..
- 高度可配置化的组件（比如：分页查询、表单提交...）
- 简单便利的工具类和hooks
- 支持mock数据
- echarts图表自然也是有的√
- 适合多环境脚本打包发布的配置

## 目录结构
```
├── public                     // 公共文件夹
├── build                      // 打包构建文件夹
├── webpack                    // 打包配置相关
├── src                        // 项目源码
│   ├── assets                 // 静态资源
│   ├── axios                  // axios请求封装
│   ├── common                 // 项目公用组件（涉及业务内容但全局通用）
│   ├── component              // 项目公用基本组件（不涉及业务内容，比如分页查询、表单等）
│   ├── hooks                  // 自定义全局钩子函数
│   ├── layout                 // 基本布局
│   ├── mock                   // mock数据
│   ├── page                   // 项目页面
│   │    ├── home              // 主页
│   │    ├── error-page        // 错误页面
│   │    ├── login             // 登录页面
│   │    └── ......
│   ├── store                  // redux相关内容
│   ├── App.tsx                // 入口页面
│   ├── index.tsx              // 入口、设置全局样式等
│   ├── index.less             // 全局样式
│   ├── lib.ts                 // 简易方法
│   └── index.less             // 全局样式
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```

## 本地开发
```
git clone https://github.com/MonKokoro/react-ts-app.git

cd react-ts-app

npm install

// 运行
npm run start

// 执行构建，将生成的build文件夹放在服务器下即可访问√
npm run build
```

## 预览
### 登录页面
![登陆页面](./src/assets/preview/login.png)
### 首页
![首页](./src/assets/preview/home.png)

## 后话
目前项目还在不断完善中，咱个人也有很多想法未实现。慢慢来吧！