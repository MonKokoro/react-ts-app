import { ReactNode } from "react";

export type ModernTableRef = {
    /** 调用一次查询 */
    search: () => void;
    /** 调用一次重置 */
    reset: () => void;
    /** 获取当前生效中的查询条件信息 */
    getSearchingValues: () => object;
    /** 清空查询条件，并调用一次查询 */
    clearSearch: () => void;
    /** 获取主表的选中项key值列表 */
    getSelectedKeys: () => string[];
    /** 获取主表的选中项详细映射 */
    getSelectedKeysMap: () => any;
    /** 获取子表的选中项key值列表，注意该方法获取的key值列表会被平铺 */
    getExpandSelectedKeys: () => any[];
    /** 获取子表的选中项key值映射，结构为 主表key: 子表key值列表 */
    getExpandSelectedKeysMap: () => any;
    /** 获取子表的选中项详细映射，结构为 主表key: 子表详细列表 */
    getExpandSelectedRowsMap: () => any;
    /** 清除表格的已选项，包括主表和子表 */
    clearSelectedKeys: () => void;
}

export type ModernTableProps = {
    /** 类型为页面还是组件，暂不可用 */
    type?: "page" | "component"
    /** 组件实例 */
    actionRef: any
    /** 搜索配置 */
    searchConfig?: searchConfigProps[]
    /** 列表接口请求方式，默认为"GET" */
    method?: "GET" | "POST"
    /** 列表请求接口地址 */
    url: string
    /** 调用接口时传给后台的额外数据，发生变化时会重新调用接口 */
    defaultData?: object
    /** 列表唯一值字段，默认为"id" */
    rowKey?: string
    /** 表格列配置，详情请参考antd官方文档 */
    columns: object[]
    /** x轴y轴的滚动。在页面模式下不建议对y轴滚动进行配置 */
    scroll?: { x?: number | string, y?: number | string }
    /** 顶部渲染区域，位置在搜索区和表格区之间 */
    topRender?: ReactNode
    /** 左侧按钮列表，位置在topRender与表格区之间 */
    leftButtonList?: leftButtonListProps[]
    /** 表格多选配置，支持跨页 */
    rowSelect?: rowSelectProps | boolean
    /** 表格禁用行配置。需要注意此禁用无法影响columns的render方法 */
    rowDisabled?: (record: any) => boolean
    /** 展开配置，内置子表的配置项，也支持自定义 */
    expand?: expandProps | false
    /** 翻页组件是否置于页面前。暂时不可用 */
    paginationFixed?: boolean
    /** 需要注入Table组件的props */
    tableProps?: object
}

export type searchConfigProps = {
    /** 表单项类型 */
    type: "Input" | "Select" | "SearchSelect" | "DatePicker" | "RangePicker"
    /** 表单项文本 */
    label: string
    /** 表单项字段值，type="RangePicker"时需要有两个 */
    name: string | [string, string]
    /** 该表单项宽度的跨列数，默认为1 */
    span?: number
    /** type="Select" | "SearchSelect"可用：下拉数据的请求地址 */
    url?: string
    /** type="SearchSelect"可用：搜索文本的字段值 */
    valueKey?: string
    /** type="Select"可用：固定的下拉数据 */
    selectList?: { value: any, desc: string }[]
}

export type leftButtonListProps = {
    /** 按钮文本 */
    text: string,
    /** 按钮点击事件 */
    onClick: () => void,
    /** 通过脚本控制按钮是否隐藏 */
    hidden?: boolean,
    /** 按钮类型，详情可参考antd的Button组件 */
    type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default"
    /** Button组件的额外props */
    props?: any
}

export type rowSelectProps = {
    /** 通过脚本控制是否隐藏多选框 */
    iconHidden?: (record: any) => boolean
    /** Table组件rowSelect属性的额外props */
    props?: any
}

export type expandProps = {
    /** 子表数据来源的对应字段值 */
    key?: string,
    /** 子表的列配置 */
    columns?: (record: any) => any[],
    /** 子表的唯一值字段 */
    rowKey?: string,
    /** 子表是否可多选 */
    rowSelect?: boolean,
    /** 展开内容自定义渲染 */
    render?: (record: any) => ReactNode
    /** 通过脚本控制展开按钮是否隐藏 */
    renderable?: (record: any) => boolean
}