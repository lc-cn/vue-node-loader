import {compileStyle} from '@vue/compiler-sfc'
import {FileInfo} from './types'
export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const tCss = (content: string): string => {
    return `
{
  const style = document.createElement('style');
  style.innerHTML = ${JSON.stringify(content)};
  document.head.appendChild(style);
};
`.trim()
}
export const tScopedCss = (file: FileInfo, id: string): string => {
    const result = compileStyle({
        source: file.content,
        filename: file.name,
        id: `data-v-${id}`,
        scoped: true,
    })
    return result.code
}
const genCssModuleAssignment = (module: string, value: string) => {
    const moduleString = JSON.stringify(module)
    return `cssModules[${moduleString}] = ${value};`
}
export function toVueCss(content: string, classNames?: object, module?: string){
    const cssModulesInsertion = module ? genCssModuleAssignment(module, JSON.stringify(classNames || {})) : ''
    return `
${tCss(content)}
${cssModulesInsertion}
`.trim()
}
