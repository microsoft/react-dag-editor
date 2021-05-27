/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-restricted-syntax */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepClone = (obj: any) => {
  if (typeof obj !== "object") {
    return obj;
  }
  const newObj = obj instanceof Array ? [] : {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      newObj[key] = deepClone(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};
