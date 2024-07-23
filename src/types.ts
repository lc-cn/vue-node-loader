import type { FileResolver, CompilerOptions } from './compiler/options';
import type { SFCFeatures, Context } from './compiler/context';
import type { TsTransform } from './compiler/transform';
export type {
    FileResolver,
    CompilerOptions,
    SFCFeatures,
    Context,
    TsTransform,
};

export type TransformResult = {
    code:string
}
export type CompileResultFile = {
    filename: string;
} & TransformResult;

export type CssFileParams = {
    lang?: string;
    scoped?: string;
    module?: string;
};

export type CompileResultCssFile = CompileResultFile & CssFileParams;

export type CompileResultExternalFile = {
    filename: string;
    query: Record<string, string>;
};

export type CompileResultExternalCssFile = CompileResultExternalFile & CssFileParams;

export type CompileResult = {
    js: CompileResultFile;
    css: CompileResultCssFile[];
    externalJs: CompileResultExternalFile[];
    externalCss: CompileResultExternalCssFile[];
    errors: Error[];
};

export type FileInfo = {
    name: string;
    content: string;
};
