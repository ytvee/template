/* events */
/**
 *
 * @param {*} event
 * @returns if the event was emited by touch device (touchpad etc)
 */
export function isTouchDeviceEvent(event: any) {
  return typeof Touch !== "undefined" && event instanceof Touch;
}
/* /events */

/* formatting */
export function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}
export const formatNumberWithPlusSign = (numberValue: number, digits = 2) => {
  return numberValue > 0 ? "+" + numberValue.toFixed(digits) : numberValue.toFixed(digits);
};
export const formatNumberWithPlusSignNoNegativeInfinity = (numberValue: number, digits = 2) => {
  return numberValue === Number.NEGATIVE_INFINITY ? "" : formatNumberWithPlusSign(numberValue, digits);
};
/* /formatting */

/* conversions */
export function base64ToBinary(base64String: string): Buffer {
  return Buffer.from(base64String, "base64");
}
export function arrayBufferToBlob(arrayBuffer: ArrayBuffer): Blob {
  return new Blob([arrayBuffer]);
}
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (result === null) {
        throw new Error();
      }
      let encoded = result.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = reject;
  });
}
/* /conversions */

/* files */
export function uploadFile(callback: (files: Array<File>) => any, isMultiple = true) {
  const input = document.createElement("input");
  input.multiple = isMultiple;
  input.type = "file";
  const changeCallback = () => {
    let files;
    if (files !== null) {
      files = input.files;
    } else {
      files = new FileList();
    }
    if (files === null) {
      throw new Error();
    }
    callback([...files]);
  };
  input.addEventListener("change", changeCallback);
  input.click();
}
export function downloadFile(blob: Blob, fileName: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}
export function getNameAndExtension(fileNameWithExtension: string): [string, string] {
  const index = fileNameWithExtension.lastIndexOf(".");

  if (index === -1) {
    return [fileNameWithExtension, ""];
  } else {
    return [fileNameWithExtension.substring(0, index), fileNameWithExtension.substring(index + 1)];
  }
}
/* /files */

/* random */
/**
 * @param max
 * @returns random integer in range [0;max)
 */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
/* /random */

/* promises */
export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}
export function isPromise(func: any): boolean {
  return func.then !== undefined;
}
/* /promises */
