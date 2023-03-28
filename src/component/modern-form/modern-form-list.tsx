/**  公共表单组件 - List表单 */

import React, { Fragment, useContext } from "react";
import { Form, Collapse, Button } from "antd";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import useDeepEffect from "@/hooks/useDeepEffect"

import { FormContext } from "./modern-form";
import ModernFormRender from "./modern-form-render";

import type { ModernFormListProps, ModernFormConfig } from "./type";
import type { ValidatorRule } from "rc-field-form/lib/interface";

const { Panel } = Collapse;

/**
 * 
 * @param title 表单卡片标题
 * @param childrenTitle List表单小标题，记得是以方法的形式传的，提供field
 * @param hideAdder 是否隐藏新增按钮，默认不隐藏
 * @param hideRemover 是否隐藏移除按钮，默认不隐藏
 * @param tip 卡片标题鼠标移入提示文本
 * @param columns 表单项列数
 * @param config 表单配置
 * @param rightRender 卡片右侧渲染
 * @param minLength List表单提交时最小长度，默认不限制
 * @param name 表单提交时List使用字段，必填
 * @param rules List表单提交规则，参考antd官方文档
 * @returns 
 */
 
function ModernFormList({
    title, 
    childrenTitle,
    hidden,
    hideAdder,
    hideRemover,
    collapse = false,
    tip,
    columns = 2, 
    config,
    rightRender,
    minLength,
    name,
    rules
}: ModernFormListProps){
    const { setConvertFunc, setTransformFunc } = useContext(FormContext)

    useDeepEffect(() => {
        setMap(config({}))
    }, [ config({}) ])

    function nameConvise(name: string | [string, string]){
        if(typeof(name) === 'string'){
            return name
        }
        else{
            return name.join('_')
        }
    }

    function setMap(conf: ModernFormConfig[]){
        let convertMap = {}, transportMap = {}
        conf.map(item => {
            if(item.convert){
                convertMap[nameConvise(item.name)] = item.convert
            }

            if(item.transform){
                transportMap[nameConvise(item.name)] = item.transform
            }
        })
        setConvertFunc(convertMap, name)
        setTransformFunc(transportMap, name)
    }

     /** config格式化 */
     function configRevise(conf: ModernFormConfig[]){
        let configByRow: any = []
        let row: any = []
        conf.map((item, index) => {
            // 变更为以行为单位
            if(item.enter || index === conf.length-1){
                row.push(item)
                configByRow.push(row)
                row = []
            }
            else{ 
                row.push(item)
            }
        })
        return configByRow
    }

    let listRules: ValidatorRule[] = []
    if(minLength){
        listRules.push({
            validator: async (_: any, names: string | any[]) => {
                if (!names || names.length < 1) {
                    return Promise.reject(new Error(`请输入至少${minLength}条${title}`));
                }
            },
        })
    }
    if(rules)
        listRules = listRules.concat(rules)
    return !hidden ? <div className="novel-form-items">
        <div className="card-top">
            <div className="title">
                <span className="title-text">{title}</span>
                {tip && <span className="title-tip">
                    {tip}
                </span>}
            </div>
            <div className="title-right">
                {rightRender && rightRender}
            </div>
        </div>
        <div className="card-context">
            <Form.List name={name} rules={listRules}>
                {(fields, { add, remove }, { errors }) => {
                    return <>
                        {
                            collapse && <Collapse className="card-content-collapse">
                                {fields.map((field, index) => {
                                    // 经过测试，Panel内部元素的渲染在外部元素渲染完成之后
                                    // 因此Panel中NovelFormRender组件的useEffect总是会比外部晚执行
                                    return <Panel 
                                        header={childrenTitle(field)} 
                                        key={field.key}
                                        extra={!hideRemover ? <CloseOutlined onClick={() => remove(field.name)}/> : ''}
                                        forceRender
                                    >
                                        <div className="form-item-list-ite">
                                            <ModernFormRender config={configRevise(config(field, index))} columns={columns} field={field} listName={name}/>
                                        </div>
                                    </Panel>
                                })}
                            </Collapse>
                        }
                        {
                            !collapse && <Fragment>
                                {fields.map((field, index) => {
                                    return <Fragment key={field.key}>
                                        {childrenTitle && <div className="novel-form-list-title">
                                            <span className="title-span">{ childrenTitle(field, index) }</span>
                                            {!hideRemover && 
                                                <CloseOutlined className="close-icon" onClick={() => remove(field.name)}
                                            />}
                                        </div>}
                                        <div className="form-item-list-ite">
                                            {!hideRemover && !childrenTitle && 
                                                <CloseOutlined className="close-icon" onClick={() => remove(field.name)}
                                            />}
                                            <ModernFormRender config={configRevise(config(field))} columns={columns} field={field} listName={name}/>
                                        </div>
                                    </Fragment>
                                })}
                            </Fragment>
                        }
                        <div className="novel-form-list-bottom">
                            <Form.ErrorList errors={errors} />
                            {!hideAdder && <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    添加
                                </Button>
                            </Form.Item>}
                        </div>
                    </>
                }}
            </Form.List>

        </div>
    </div> : <></>
}
 
export default ModernFormList