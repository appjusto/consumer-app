export const safeRouteParams = (params: { [k: string]: string }) =>
  Object.keys(params).reduce((r, key) => ({ ...r, [key]: safeRouteParam(params[key]) }), {});

export const safeRouteParam = (param: string) => param.replace(/\(/g, '%28').replace(/\)/g, '%29');
