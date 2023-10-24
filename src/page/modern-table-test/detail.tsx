import React, { useState, useEffect, useRef } from "react"
import Drawer from "@/component/drawer"
// import DetailForm from "@/component/detail-form";
import ContentCard from "@/component/content-card";
import lib from "@/lib";

function Detail({ show, data, onClose }: DetailProps){
    const [ visible, setVisible ] = useState(show || false)
    const [ param, setParam ] = useState({})

    useEffect(() => {
        setVisible(show || false)
        if(show){
            getDetail(data)
        }
    }, [show])

    function getDetail(data: any){
        lib.request({
            url: "/mock/getBondMemberDetail",
            data: { ...data },
            method: "GET",
            needMask: true,
            success: (res: any) => {
                setParam(res)
            }
        })
    }

    const baseConfig = [
        {label: "客户名称", key: "enterpriseName"},
        {label: "所属行业", key: "industryName"},
        {label: "证件类型", key: "documentTypeName"},
        {label: "证件号码", key: "documentCode"},
        {label: "证件资料", key: "certificateId", fileNameKey: "certificateName"},
        {label: "开户银行名称", key: "openBankName"},
        {label: "联行号", key: "openBankCode"},
        {label: "银行开户名", key: "openBankAccountName"},
        {label: "银行卡号", key: "openBankAccountNumber"},
        {label: "联系人", key: "contactPerson"},
        {label: "联系人手机号", key: "contactPhoneNumber"},
        {label: "联系地址", key: "contactAddress", span: 2},
        {label: "邮编", key: "postalCode"},
        {label: "邮箱", key: "contactEmail"},
        {label: "法定代表人姓名", key: "legalPersonName"},
        {label: "法定代表人手机号", key: "legalPersonPhone"},
        {label: "法定代表人证件类型", key: "legalPersonCertificateTypeName"},
        {label: "法定代表人证件号码", key: "legalPersonCertificateCode"},
        {label: "法人证件开始日期", key: "legalPersonCertificateStartDate"},
        {label: "法人证件结束日期", key: "legalPersonCertificateEndDate"},
        {label: "法定代表人身份证正面", key: "legalPersonCertificatePositiveId", fileNameKey: "legalPersonCertificatePositiveName" },
        {label: "法定代表人身份证反面", key: "legalPersonCertificateBackId", fileNameKey: "legalPersonCertificateBackName" },
    ]

    return <Drawer
        title="成员详情"
        open={visible}
        onClose={() => {
            setVisible(false)
            onClose(false)
            setParam({})
        }}
    >
        <div className="modern-table-detail-drawer" style={{margin: "0 16px"}}>
            {/* <DetailForm 
                title={"基本信息"}
                config={ baseConfig }
                param={ param }
                column={2}
            /> */}
            <ContentCard title="成员信息">

            </ContentCard>
        </div>
    </Drawer>
}

type DetailProps = {
    show: boolean,
    data?: any,
    onClose: (flag?: boolean) => void
}
export default Detail