export const hexToRgbA = (hex: string): string => {
  let code: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    code = hex.substring(1).split("");

    if (code.length == 3) {
      code = [code[0], code[0], code[1], code[1], code[2], code[2]];
    }

    code = "0x" + code.join("");
    return "rgba(" + [(code >> 16) & 255, (code >> 8) & 255, code & 255].join(",") + ", 0.1)";
  }

  // throw new Error("Hex code is wrong!");
  return "";
};

export const getSoundPowerBySoundLevel = (soundLevel: number): number => {
  return 10 * Math.log10(soundLevel ** 2);
};
export function computePowerByLevelSquare(levelSquare: number): number {
  return 10 * Math.log10(levelSquare);
}

export function arithmeticMean(array: Float32Array): number {
  let mean = 0;
  for (let i = 0; i < array.length; i++) {
    mean += array[i];
  }
  mean /= array.length;
  return mean;
}
export function squareMean(array: Float32Array, divider: number = array.length): number {
  if (!array.length) {
    return 0;
  }
  let mean = 0;
  for (let i = 0; i < array.length; i++) {
    mean += array[i] ** 2;
  }
  mean /= divider;
  return mean;
}

export function secondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}
export function millisecondsToSeconds(milliseconds: number): number {
  return milliseconds / 1000;
}

/**
 * to generate unique identifiers
 */
function getUserId(): string {
  //TODO: get and return some unique user information from auth module such Sub field of id_token
  return "testUserId";
}
export function generateUniqueId(): string {
  return `${getUserId()}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}
