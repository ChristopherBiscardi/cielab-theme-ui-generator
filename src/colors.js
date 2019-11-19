import space from "color-space";

export function lchuvToRgbString([l, c, h]) {
  const colorArray = space.lchuv.rgb([l, c, h]);
  return `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
}
