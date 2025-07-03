interface LookupItem {
  value: number;
  symbol: string;
}

const LOOKUP: Array<LookupItem> = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "K" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "G" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
];

const TRAILING_ZERO_FILTER = /\.0+$|(\.[0-9]*[1-9])0+$/;

export default function (number: number, digits = 1): string {
  if (number === 0) return "0";

  const item: LookupItem | undefined = LOOKUP.filter((item: LookupItem) => Math.abs(number) >= item.value).pop();

  const temp: number = number / (item?.value ?? 1);
  let result: string;
  result = temp.toFixed(digits).toString();
  result = result.replace(TRAILING_ZERO_FILTER, "$1");
  result += item?.symbol;

  return result;
}
