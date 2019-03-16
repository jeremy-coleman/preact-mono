import { getDependencyTree, Reaction } from "mobx"
import {RefObject} from "preact/types"

export function printDebugValue(v: RefObject<Reaction | null>) {
    if (!v.current) {
        return "<unknown>"
    }
    return getDependencyTree(v.current)
}
