/** 设置页码 */

import { useState, useEffect } from 'react'

export default function usePage({ current, pageSize, total }) {
    const [ page, setPage ] = useState({})
    useEffect(() => {
        setPage({
            current,
            pageSize,
            total
        })
    }, [])
    return [ page, setPage ]
}