export const randomInt: (min: number, max: number) => number = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
