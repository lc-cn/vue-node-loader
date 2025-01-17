import type { BindingMetadata, SFCDescriptor } from '@vue/compiler-sfc';

import { join } from 'path';

import type { CompileResultExternalFile, CompilerOptions } from '@/types';

import { FILENAME, ROOT, ID } from './constants';
import { getDestPath } from './options';
import {randomInt} from "@/utils";

export type Context = {
  isProd: boolean;
  hmr: boolean;
  root: string;
  filename: string;
  fullpath: string;
  id: string;
  destFilename: string;
  options: CompilerOptions;
  features: SFCFeatures;
  addedProps: Array<[key: string, value: string]>;
  addedCodeList: string[];
  externalJsList: CompileResultExternalFile[];
  externalCssList: CompileResultExternalFile[];
  bindingMetadata: BindingMetadata | undefined;
};

export type SFCFeatures = {
  hasStyle?: boolean;
  hasScoped?: boolean;
  hasCSSModules?: boolean;
  hasScriptSetup?: boolean;
  hasTemplate?: boolean;
  hasTS?: boolean;
};

export const resolveFeatures = (
  descriptor: SFCDescriptor,
  context: Context
) => {
  const { filename, features, addedProps, addedCodeList, id } = context;
  const scriptLang =
    (descriptor.script && descriptor.script.lang) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.lang) ||
    'js';
  features.hasTS = scriptLang === 'ts';
  descriptor.styles.some((style) => {
    if (style.scoped) {
      features.hasScoped = true;
    }
    if (style.module) {
      features.hasCSSModules = true;
    }
    features.hasStyle = true;
    return features.hasScoped && features.hasCSSModules && features.hasStyle;
  });
  if (features.hasScoped) {
    addedProps.push(['__scopeId', JSON.stringify(`data-v-${id}`)]);
  }
  if (features.hasCSSModules) {
    addedProps.push(['__cssModules', `cssModules`]);
    addedCodeList.push('const cssModules= {}');
  }
  if (!context.isProd) {
    addedProps.push(['__file', JSON.stringify(filename.replace(/\\/g, '/'))]);
  }
};

export const createContext = (
  source: string,
  options?: CompilerOptions
): Context => {
  const root = options?.root ?? ROOT;
  const filename = options?.filename ?? FILENAME;
  const fullpath = join(root, filename);
  const destFilename = getDestPath(options?.filename ?? FILENAME);
  const id = options?.filename ? `${filename}-${randomInt(1000000,99999999)}` : ID;
  return {
    isProd: options?.isProd ?? false,
    hmr: options?.hmr ?? false,
    root,
    filename,
    fullpath,
    id,
    destFilename,
    options: options ?? {},
    features: {},
    addedProps: [],
    addedCodeList: [],
    externalJsList: [],
    externalCssList: [],
    bindingMetadata: undefined,
  };
};
