import React, { ReactNode } from "react";
import { NamePath } from "antd/es/form/interface";
import { ValidatorRule } from "rc-field-form/lib/interface";

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

export type ModernFormProps = {
    /** 组件实例 */
    childRef: React.Ref<ModernFormRef>
    /** 表单布局，默认为"vertical" */
    layout?: "horizontal" | "vertical" | "inline"
    /** 导入表单的数据，在发生变化时触发导入事件 */
    importData?: any
    /** 块内的内容 */
    children: ReactNode
}

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
    /** 单个列表项是否可收起，默认不可收起。这里收起功能使用的是Collapse组件 */
    collapse?: boolean,
    /** 表单列表的tip描述 */
    tip?: string,
    /** 一行占据几个表单项，默认为2 */
    columns?: number, 
    /** 表单项配置 */
    config: (field: any, index?: number) => ModernFormConfig[],
    /** 标题右侧区域渲染 */
    rightRender?: ReactNode,
    /** 表单列表的最小数量，小于该数量时不允许提交 */
    minLength?: number,
    /** 表单列表在form组件中的对应字段 */
    name: string,
    /** Form.List额外的规则限制 */
    rules: ValidatorRule[]
}

export type ModernFormConfig = {
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
    config: ModernFormRenderConfig[]
    /** 需要表单列表识别的field值 */
    field?: any
    /** 需要表单列表识别的列表key值 */
    listName?: string
}

export type ModernFormRenderConfig = {

}