export const truncated = (param: string, max = 8): string => {
  return param.length > max ? `${param.substring(0, max / 2)}…${param.substring(param.length - max / 2)}` : param;
};
