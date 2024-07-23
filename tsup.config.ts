import {defineConfig} from "tsup";
export default defineConfig((options)=>{
    return {
        entry: ["src/index.ts"],
        outDir: "lib",
        format: ["cjs", "esm"],
        outExtension({format}) {
            return {
                js: `.${format === "cjs" ? "cjs" : "mjs"}`
            }
        },
        dts: true,
        clean: true,
        sourcemap: true
    }
})
