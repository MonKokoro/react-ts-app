/** 防抖函数，为解决lodash作用在函数上会被重新构建的问题 */

import { useRef } from 'react'

export default function useDebounce(fn: Function, delay: number) {
    const timer = useRef<any>();

    return (...args: any) => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            fn(args);
        }, delay);
    }
}
  