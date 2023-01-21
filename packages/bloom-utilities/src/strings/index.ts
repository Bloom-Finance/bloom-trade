const sum = (a: any, b: any, positions: number) => {
  const factor = Math.pow(10, positions);
  return (
    (a.toFixed(positions) * factor + b.toFixed(positions) * factor) / factor
  );
};
const isBase64 = (string: string) => {
  const base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(string);
};

const stringToMilisecondsDate = (string: string) => {
  const date = new Date(string);
  return date.getTime();
};
const sumTwoFloatingStrings = (a: string, b: string, decimals: number) => {
  return sum(parseFloat(a), parseFloat(b), decimals);
};

export { isBase64, stringToMilisecondsDate, sumTwoFloatingStrings };
