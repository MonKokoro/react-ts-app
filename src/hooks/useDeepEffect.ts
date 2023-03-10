/** 深度useEffect对比 */

import { useEffect, useRef } from 'react'
import isEqual from 'lodash/isEqual'

export default function useDeepEffect(fn: Function, deps: any[]) {
    const isFirst = useRef(true);
    const prevDeps = useRef(deps);
    useEffect(() => {
        const isSame = prevDeps.current.every((obj: any, index: number) =>
            isEqual(obj, deps[index])
            // obj == deps[index]
        );
        if (isFirst.current || !isSame) {
            fn();
        }
        isFirst.current = false;
        prevDeps.current = deps;
    }, deps);
}
  