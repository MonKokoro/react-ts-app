import React, { ReactNode } from "react";
import type { FormRule } from 'antd'
import { NamePath } from "antd/es/form/interface";
import { ValidatorRule } from "rc-field-form/lib/interface";

/** ModernForm - 组件实例 */
export type ModernFormRef = {
    /** 直接返回antd的form对象，使父组件能直接使用antd的form方法 */
    form: () => any
    /** 触发表单提交事件，将会返回经过ModernForm处理过后的数据 */
    submit: () => Promise<any>
    /** 批量获取表单数据，可参考Form组件getFieldsValue方法 */
    getValues: (values?: any) => any
    /** 单个获取表单数据。为了区分管理，将其与批量获取分开 */
    getValue: (value: string | number) => any
    /** 为单个表单项赋值，注意该方法不会适用convert格式化，会直接将原始数据传给Form组件 */
    setValue: (key: string | number, value: any) => void
    /** 为多个表单项赋值，注意该方法不会适用convert格式化，会直接将原始数据传给Form组件 */
    setValues: (object: any) => void
    /** 为多个表单项赋值，注意该方法会经过convert的格式化 */
    setValuesConvert: (object: any) => void
    /** 批量清除部分表单项的值 */
    clear: (keys: (string | number)[]) => void
    /** 清除所有表单项的值，重置表单，可参考resetFields方法 */
    reset: (keys: NamePath[]) => void
}

/** ModernForm - props */
export type ModernFormProps = {
    /** 组件实例 */
    childRef: React.Ref<ModernFormRef>
    /** 表单布局，默认为"vertical" */
    layout?: "horizontal" | "vertical" | "inline"
    /** 导入表单的数据，在发生变化时触发导入事件 */
    importData?: any
    /** 块内的内容 */
    children: ReactNode
    /** 自定义类名 */
    className?: string
}

/** ModernFormList - props */
export type ModernFormListProps = {
    /** 表单列表的标题 */
    title: string, 
    /** List表单小标题，记得是以方法的形式传的，提供field和index */
    childrenTitle?: (field: any, index?: number) => string,
    /** 脚本控制是否隐藏整个表单列表卡片 */
    hidden?: boolean,
    /** 是否隐藏新增按钮，默认不隐藏 */
    hideAdder?: boolean,
    /** 是否隐藏移除按钮，默认不隐藏 */
    hideRemover?: boolean,
    /** 单个列表项是否可收起，默认不可收起。这里收起功能使用的是Collapse组件，为true时必须设置childrenTitle属性 */
    collapse?: boolean,
    /** 表单列表的tip描述 */
    tip?: string | ReactNode,
    /** 一行占据几个表单项，默认为2 */
    columns?: number, 
    /** 表单项配置 */
    config: (field: any, index?: number) => FormItemType[],
    /** 标题右侧区域渲染 */
    rightRender?: ReactNode,
    /** 表单列表的最小数量，小于该数量时不允许提交 */
    minLength?: number,
    /** 表单列表在form组件中的对应字段 */
    name: string,
    /** Form.List额外的规则限制 */
    rules?: ValidatorRule[]
}

/** ModernFormItems - props */
export type ModernFormItemsProps = {
    /** 表单组的标题 */
    title: string, 
    /** 表单组的tip描述 */
    tip?: string,
    /** 一行占据几个表单项，默认为2 */
    columns?: number, 
    /** 表单项配置 */
    config?: FormItemType[],
    /** 标题右侧区域渲染 */
    rightRender?: ReactNode,
    /** 自定义渲染内容。设置后，将仅保留ModernFormItems的样式 */
    contentRender?: ReactNode
}

/** ModernFormConfig - 基本配置项 */
interface ModernFormConfigBase {
    /** 表单项文本描述 */
    label: string
    /** 是否必填，默认非必填 */
    required?: boolean
    /** 是否隐藏该表单项，默认不隐藏 */
    hidden?: boolean
    /** 是否禁用该表单项，默认不禁用 */
    disabled?: boolean
    /** 为该表单项赋值前，先通过convert方法转化为目标值后再传入。返回值为该表单项在Form组件内可识别的内容 */
    convert?: (value: any, param: any) => any
    /** 触发表单提交前，先通过transform方法转化为目标值后再提交。返回值必须是一个对象 */
    transform?: (value: any, param: any) => {[key: string]: any}
    /** 是否在该表单项后强制换行 */
    enter?: boolean
    /** 需要传给对应antd组件的额外props */
    props?: any
    /** 表单项提交规则rules */
    rules?: FormRule[]
    /** 表单项跨列宽度，默认为1 */
    span?: number
    /** 鼠标移入提示语句 */
    tooltip?: string
    /** 配置noStyle后，本表单项将仅作为样式存在 */
    noStyle?: boolean
}

/** ModernFormConfig - 文本框/文本搜索框/密码框 配置项 */
export interface FormInput extends ModernFormConfigBase {
    /** 文本框 文本搜索框 密码框 */
    type: "Input" | "InputSearch" | "InputPassword",
    /** 表单项字段值 */
    name: string,
    /** 可输入的最大长度 */
    maxLength?: number
    /**
     * 针对文本框，内置一些常用的正则验证方法。如果其它rules验证规则的话，可使用rules属性自定义
     * @param eMail 邮箱格式
     * @param cellPhone 手机号格式
     */
    rulesReg?: "eMail" | "cellPhone"
}

/** ModernFormConfig - 静态文本配置项 */
export interface FormSpan extends ModernFormConfigBase {
    /** 静态文本 */
    type: "Span",
    /** 表单项字段值 */
    name: string
}

/** ModernFormConfig - 文本域配置项 */
export interface FormTextArea extends ModernFormConfigBase {
    /** 文本域 */
    type: "TextArea",
    /** 表单项字段值 */
    name: string,
    /** 可输入的最大长度 */
    maxLength?: number
    /** 限制文本域的高度 */
    height?: number
}

/** ModernFormConfig - 数字框配置项 */
export interface FormInputNumber extends ModernFormConfigBase {
    /** 数字框 */
    type: "InputNumber",
    /** 表单项字段值 */
    name: string,
    /** 最大最小值限制。一般情况下最大最小值都是需要限制的，如有特殊需求只能限制一边，可以用props属性解决 */
    limit?: [number, number],
    /** 小数位数限制 */
    precision?: number
}

/** ModernFormConfig - 数值域配置项 */
export interface FormNumberRange extends ModernFormConfigBase {
    /** 数值域 */
    type: "NumberRange",
    /** 表单项字段值 */
    name: string,
    /** 最大最小值限制。一般情况下最大最小值都是需要限制的，如有特殊需求只能限制一边，可以用props属性解决 */
    limit?: [number, number],
    /** 小数位数限制 */
    precision?: number
}

/** ModernFormConfig - 下拉框基本配置项 */
interface FormSelectBase extends ModernFormConfigBase {
    /** 下拉框 */
    type: "Select",
    /** 表单项字段值 */
    name: string,
    /** [key字段, 文本字段]的映射值，默认为["value", "desc"] */
    usedKey?: [string, string]
    /** 下拉选项点击事件，可返回本选项下的全部数据 */
    onChange?: (value: any, option: any, record: any) => void
}

/** ModernFormConfig - 下拉框配置项 - 静态模式 */
export interface FormSelectList extends FormSelectBase {
    /** 表单项字段值 */
    name: string,
    /** 静态下拉数据 */
    selectList: {value: any, desc: string | number}[]
}

/** ModernFormConfig - 下拉框配置项 - 接口模式 */
export interface FormSelectAxios extends FormSelectBase {
    /** 下拉接口调用 */
    url: string
    /** 表单项字段值 */
    name: string,
    /** 下拉接口请求方式，默认为"GET"。原则上不推荐修改 */
    method?: "GET" | "POST"
    /** 调用接口时的额外传参 */
    defaultData?: any
}

/** ModernFormConfig - 下拉框配置项 - 字典模式 */
export interface FormSelectCode extends FormSelectBase {
    /** 表单项字段值 */
    name: string,
    /** 若您的系统存在数据字典功能，即可通过此方法调用公用的字典接口，代替繁琐的url方式 */
    queryCode: string
}

/** ModernFormConfig - 下拉搜索框配置项 */
export interface FormSearchSelect extends ModernFormConfigBase {
    /** 下拉搜索框，用于防抖模糊查询功能 */
    type: "SearchSelect",
    /** key值字段，名称字段。由于下拉搜索框在表单初期渲染时不会获取数据，像编辑这样的场合如果没有名称字段，会把key值暴露出来 */
    name: [ string, string ],
    /** 接口调用 */
    url: string
    /** 接口请求方式，默认为"GET"。原则上不推荐修改 */
    method?: "GET" | "POST"
    /** 调用接口时的额外传参 */
    defaultData?: any
    /** 模糊查询时所使用的字段 */
    valueKey: any
    /** [key字段, 文本字段]的映射值，默认为["value", "desc"] */
    usedKey?: [string, string]
    /** 下拉选项点击事件，可返回本选项下的全部数据 */
    onChange?: (value: any, record: any) => void
}

export interface FormDatePicker extends ModernFormConfigBase {
    /** 日期选择框 */
    type: "DatePicker",
    /** 表单项字段值 */
    name: string
}

/** ModernFormConfig - 开关配置项 */
export interface FormSwitch extends ModernFormConfigBase {
    /** 开关组件 */
    type: "Switch",
    /** 表单项字段值 */
    name: string,
    /** 开关状态改变事件 */
    onChange: (checked: boolean, field: any) => void
}

/** ModernFormConfig - 自定义组件配置项 */
export interface FormCustom extends ModernFormConfigBase {
    /** 自定义组件 */
    type: "Custom",
    /** 表单项字段值 */
    name: string,
    /** 自定义渲染区域 */
    render: () => ReactNode
}

export type FormItemType = FormInput | FormInputNumber | FormSpan | FormInputNumber | FormNumberRange | FormTextArea | FormSelectList | FormSelectAxios | FormSelectCode | FormSearchSelect | FormDatePicker | FormSwitch | FormCustom

export interface ModernFormConfig {
    /** 表单项类型 */
    type: "Input" | "Span" | "InputSearch" | "InputPassword" | "InputNumber" | "NumberRange" | "TextArea" | "Select" | "SearchSelect" | "Switch" | "Upload" | "Custom"
    /** 表单项字段值，部分类型可传两个 */
    name: string | [string, string]
    /** 是否隐藏该表单项，默认不隐藏 */
    hidden?: boolean
    /** 是否禁用该表单项，默认不禁用 */
    disabled?: boolean
    /** 为该表单项赋值前，先通过convert方法转化为目标值后再传入。返回值为该表单项在Form组件内可识别的内容 */
    convert?: (value: any, param: any) => any
    /** 触发表单提交前，先通过transform方法转化为目标值后再提交。返回值必须是一个对象 */
    transform?: (value: any, param: any) => {[key: string]: any}
    /** 是否在该表单项后强制换行 */
    enter?: boolean
    /** 需要传给对应antd组件的额外props */
    props?: any
    /** 【"Input" | "InputSearch" | "InputPassword" | "TextArea"】可输入的最大长度 */
    maxLength?: number
    /** 【"TextArea"】限制文本域的高度 */
    height?: number
    /** 【"InputNumber"】可输入的最大最小限制。一般需要同时设置，如果只需设置一边，建议使用props属性 */
    limit?: [number, number]
    /** 【"InputNumber"】可输入的小数精度 */
    precision?: number
}

export type ModernFormRenderProps = {
    /** 一行占据几个表单项，默认为2 */
    columns?: number
    /** 由ModernForm内部识别的表单项配置 */
    config: FormItemType[]
    /** 需要表单列表识别的field值 */
    field?: any
    /** 需要表单列表识别的列表key值 */
    listName?: string
}

export type ModernFormRenderConfig = {

}