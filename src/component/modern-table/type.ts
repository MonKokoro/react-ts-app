import { ReactNode } from "react";

export type ModernTableRef = {
    search: () => void;
    reset: () => void;
    getSearchingValues: () => object;
    clearSearch: () => void;
    getSelectedKeys: () => string[];
    getSelectedKeysMap: () => any;
    getExpandSelectedKeys: () => any[];
    getExpandSelectedKeysMap: () => any;
    getExpandSelectedRowsMap: () => any;
}

export type ModernTableProps = {
    type?: "page" | "component"
    actionRef: any
    searchConfig?: searchConfigProps[]
    method?: "GET" | "POST"
    url: string
    defaultData?: object
    rowKey?: string
    columns: object[]
    scroll?: { x?: number, y?: number }
    topRender?: ReactNode
    leftButtonList?: leftButtonListProps[]
    rowSelect?: rowSelectProps | boolean
    rowDisabled?: (record: any) => boolean
    expand?: expandProps | false
    paginationFixed?: boolean
    tableProps?: object
}

export type searchConfigProps = {
    type: "Input" | "Select" | "DatePicker"
    label: string
    name: string
}

export type leftButtonListProps = {
    text: string,
    onClick: () => void,
    hidden?: boolean,
    type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default"
    props?: any
}

export type rowSelectProps = {
    iconHidden?: (record: any) => boolean
    props?: any
}

export type expandProps = {
    key?: string,
    columns?: (record: any) => any[],
    rowKey?: string,
    rowSelect?: boolean,
    render?: (record: any) => ReactNode
    renderable?: (record: any) => boolean
}