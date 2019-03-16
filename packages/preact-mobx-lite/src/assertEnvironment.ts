import { spy } from "mobx"
import { useState } from "preact/hooks"

if (!useState) {
    throw new Error("mobx-preact-lite requires Preact with Hooks support")
}
if (!spy) {
    throw new Error("mobx-preact-lite requires mobx at least version 4 to be available")
}
