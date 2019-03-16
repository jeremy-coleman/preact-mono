import * as mobx from "mobx"
import { useMemo } from "preact/hooks"

export function useComputed<T>(func: () => T, inputs: ReadonlyArray<any> = []): T {
    const computed = useMemo(() => mobx.computed(func), inputs)
    return computed.get()
}
