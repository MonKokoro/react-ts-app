/** 弹窗/抽屉等组件简易配置hook */

import { useState } from 'react'

export default function useCompShow() {
    const [ modal, setModal ] = useState({ show: false, param: null })

    function open(param){
        setModal({ show: true, param })
    }

    function close(){
        setModal({ show: false, param: null })
    }

    return {
        show: modal.show,
        param: modal.param,
        open,
        close
    }
}