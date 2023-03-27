export const tryJsonParse = (str: string, defaultValue?: any) => {
  try {
    return JSON.parse(str) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};
