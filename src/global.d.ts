import type { serviceProps } from '@/axios'

declare namespace React {
    let $request: (props: serviceProps) => Promise<any>;
    // let app:<T>(c:T) => T
    // function appp<T>(c:T):T
}