import {toVueCss, tScopedCss} from "@/utils";
import {compileSfc} from "@/compiler";

/**
 * 将 sfc 转换为 js
 * @param source
 * @param filename
 */
export function compile(source:string,filename:string):string {
    const {js,css}=compileSfc(source,{filename})
    // styles
    const compiledCss = css.map((cssFile) => {

        if (cssFile.scoped) {
            return toVueCss(tScopedCss({
                name: cssFile.filename,
                content: cssFile.code
            }, cssFile.scoped))
        }
        return toVueCss(cssFile.code)
    })
    return `${js.code}\n${compiledCss.join('\n')}`
}
