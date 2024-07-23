import { parse } from '@vue/compiler-sfc';

import type { CompilerOptions, CompileResult, Context } from '../types';
import { resolveImports } from './transform';
import { createContext, resolveFeatures } from './context';
import { resolveScript } from './script';
import { resolveTemplate } from './template';
import { resolveStyles } from './style';

const getErrorResult = (
  errors: (string | Error)[],
  filename: string
): CompileResult => ({
  js: { filename, code: '' },
  css: [],
  externalJs: [],
  externalCss: [],
  errors: errors.map((error) =>
    typeof error === 'string' ? new Error(error) : error
  ),
});

/**
 * NOTICE: this API is experimental and may change without notice.
 * Compile a vue file into JavaScript and CSS.
 *
 * @param source the source code of the vue file
 * @param options the compilation options
 */
export function compileSfc(
  source: string,
  options?: CompilerOptions
): CompileResult {
  const context: Context = createContext(source, options);

  // get the code structure
  const { descriptor, errors: mainCompilerErrors } = parse(source, {
    filename: context.filename,
  });
  if (mainCompilerErrors.length) {
    return getErrorResult(mainCompilerErrors, context.destFilename);
  }

  // get the features
  resolveFeatures(descriptor, context);

  const { result: scriptResult, errors: scriptErrors } = resolveScript(
    descriptor,
    context
  );
  const { result: templateResult, errors: templateErrors } = resolveTemplate(
    descriptor,
    context
  );
  const {
    files: cssFiles,
    importList: cssImportList,
    errors: styleErrors,
  } = resolveStyles(descriptor, context);

  const errors = [
    ...mainCompilerErrors,
    ...(scriptErrors ?? []),
    ...(templateErrors ?? []),
    ...(styleErrors ?? []),
  ];
  if (
    errors.length ||
    !scriptResult ||
    !templateResult ||
    !cssFiles ||
    !cssImportList
  ) {
    return getErrorResult(errors, context.destFilename);
  }

  // No source map update technically.
  const jsCode = context.options?.autoResolveImports
    ? resolveImports(scriptResult.code, context.options)
    : scriptResult.code;


  return {
    js: {
      filename: context.destFilename,
      code: jsCode,
    },
    css: cssFiles,
    externalJs: context.externalJsList,
    externalCss: context.externalCssList,
    errors: [],
  };
};
