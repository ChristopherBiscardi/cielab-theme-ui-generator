/** @jsx jsx */
import { useState, useEffect, useRef } from "react";
import { jsx } from "theme-ui";
import LineGraph from "../components/line-chart";
// import { randomUniform } from "d3-random";
import bestContrast from "get-best-contrast-color";
import getContrastRatio from "get-contrast-ratio";
import { useHotkeys } from "react-hotkeys-hook";

import { range } from "d3-array";
import { lchuvToRgbString } from "../colors";
import { hsluvToHex, hpluvToHex, hexToHsluv, hexToHpluv } from "hsluv";
// console.log(space.lchuv.rgb([80, 50, 60]));

// lchuv is
// 100,100,360
const lightnessScale = range(5, 100, 14);
const colorLabels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
// const colorHues = range(0, 340, 38);
const colors = {
  Gray: [267.2, 0],
  Blue: [286.9, 70],
  Cyan: [255.1, 70],
  Green: [163.7, 70],
  Yellow: [55.5, 70],
  Orange: [39.7, 70],
  Red: [11.5, 70],
  Purple: [320.2, 70],
  Violet: [302.7, 70]
};
const state = {
  grid: Object.entries(colors).reduce(
    (acc, [colorName, hc]) => ({
      ...acc,
      [colorName]: Array.from({ length: 10 }).map((v, i) => [
        100 - colorLabels[i] / 10,
        hc[1],
        hc[0]
      ])
    }),
    {}
  )
};
console.log(state);
export default props => {
  const [currentColor, setCurrentColor] = useState({ name: "Gray", index: 4 });

  useHotkeys(
    "w",
    () => {
      const listOfColors = Object.keys(state.grid);
      const currentColorRowIndex = listOfColors.findIndex(
        colorKey => colorKey === currentColor.name
      );
      if (listOfColors[currentColorRowIndex - 1]) {
        return setCurrentColor({
          ...currentColor,
          name: listOfColors[currentColorRowIndex - 1]
        });
      } else {
        return setCurrentColor({
          ...currentColor,
          name: listOfColors[listOfColors.length - 1]
        });
      }
    },
    [currentColor]
  );
  useHotkeys(
    "s",
    () => {
      const listOfColors = Object.keys(state.grid);
      const currentColorRowIndex = listOfColors.findIndex(
        colorKey => colorKey === currentColor.name
      );
      if (listOfColors[currentColorRowIndex + 1]) {
        return setCurrentColor({
          ...currentColor,
          name: listOfColors[currentColorRowIndex + 1]
        });
      } else {
        return setCurrentColor({
          ...currentColor,
          name: listOfColors[0]
        });
      }
    },
    [currentColor]
  );

  useHotkeys(
    "d",
    () => {
      const listOfColors = state.grid[currentColor.name];
      if (listOfColors[currentColor.index + 1]) {
        return setCurrentColor({
          ...currentColor,
          index: currentColor.index + 1
        });
      } else {
        return setCurrentColor({
          ...currentColor,
          index: 0
        });
      }
    },
    [currentColor]
  );
  useHotkeys(
    "a",
    () => {
      const listOfColors = state.grid[currentColor.name];
      if (listOfColors[currentColor.index - 1]) {
        return setCurrentColor({
          ...currentColor,
          index: currentColor.index - 1
        });
      } else {
        return setCurrentColor({
          ...currentColor,
          index: listOfColors.length - 1
        });
      }
    },
    [currentColor]
  );
  return (
    <div sx={{ display: "flex", background: "#edf8fe" }}>
      <ColorPicker />
      <ColorGrid
        setCurrentColor={setCurrentColor}
        currentColor={currentColor}
      />
      <ColorColumn
        currentIndex={currentColor.index}
        title={currentColor.name}
        colors={state.grid[currentColor.name]}
        axisLabels={colorLabels}
      />
      <ColorColumn
        currentIndex={currentColor.index}
        title={colorLabels[currentColor.index]}
        colors={Object.entries(state.grid).map(
          ([, values]) => values[currentColor.index]
        )}
        axisLabels={Object.keys(state.grid)}
      />
    </div>
  );
};
const ColorPicker = () => <div></div>;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const ColorGrid = ({ setCurrentColor, currentColor }) => {
  const currentButton = useRef();
  useEffect(() => {
    console.log(currentButton);
    currentButton && currentButton.current.focus();
  });
  return (
    <div>
      <table sx={{ borderSpacing: 0 }}>
        <caption>ColorGrid</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            {colorLabels.map(label => (
              <th
                scope="col"
                key={label}
                sx={{
                  fontFamily: "system-ui",
                  color: "rgb(119,119,119)",
                  fontSize: ".5rem",
                  textAlign: "left"
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.keys(colors).map(name => (
            <tr key={name}>
              <th
                scope="row"
                key={name}
                sx={{
                  margin: 0,
                  padding: "0 .5rem",
                  fontSize: ".5rem",
                  fontFamily: "system-ui",
                  color: "rgb(119,119,119)",
                  textAlign: "right"
                }}
              >
                {name}
              </th>
              {state.grid[name].map((lchuvColor, i) => {
                const rgbString = lchuvToRgbString(lchuvColor);

                const bestColor = bestContrast(rgbString, [
                  lchuvToRgbString(state.grid.Gray[0]),
                  lchuvToRgbString(state.grid.Gray[state.grid.Gray.length - 1])
                ]);
                const bestColorContrast = getContrastRatio(
                  rgbString,
                  bestColor
                );
                return (
                  <td
                    key={name + "-" + rgbString + "-" + i}
                    sx={{ padding: 0, lineHeight: 0 }}
                  >
                    <button
                      ref={
                        name === currentColor.name && currentColor.index === i
                          ? currentButton
                          : null
                      }
                      sx={{
                        backgroundColor: rgbString,
                        border: `2px solid ${
                          name === currentColor.name && currentColor.index === i
                            ? "white"
                            : rgbString
                        }`,
                        height: "100%",
                        width: "100%",
                        padding: ".25rem .75rem",
                        outline: "none",
                        "&:focus": {
                          borderColor: "#fff"
                        }
                      }}
                      onClick={() => {
                        setCurrentColor({ name, index: i });
                      }}
                    >
                      <span
                        sx={{
                          color: bestColor,
                          fontVariantNumeric: "tabular-nums"
                        }}
                      >
                        {bestColorContrast}
                      </span>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const ColorRow = ({ colors, labels, currentIndex }) => (
  <div sx={{ padding: "1rem", display: "flex" }}>
    {colors.map((lchuvColor, i) => {
      const rgbString = lchuvToRgbString(lchuvColor);

      return (
        <div key={i} sx={{ display: "flex", flexDirection: "column" }}>
          <span sx={{ fontSize: "12px" }}>{labels[i]}</span>
          <button
            key={i}
            sx={{
              backgroundColor: rgbString,
              height: "20px",
              width: "40px",
              border: "1px solid transparent",
              borderColor: i === currentIndex ? "white" : "transparent"
            }}
          >
            <span sx={{ display: "none" }}>{rgbString}</span>
          </button>
        </div>
      );
    })}
  </div>
);

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
// var dataset = range(10).map(function(d) {
//   return { y: randomUniform(1)() };
// });

const ColorColumn = ({ title, colors, axisLabels, currentIndex }) => {
  console.log("currentColor", colors[currentIndex]);
  const linesData = colors.reduce(
    (acc, lchColor, idx) => ({
      l: acc.l.concat({ y: lchColor[0], color: colors[idx] }),
      c: acc.c.concat({ y: lchColor[1], color: colors[idx] }),
      h: acc.h.concat({ y: lchColor[2], color: colors[idx] })
    }),
    {
      l: [],
      c: [],
      h: []
    }
  );
  // console.log(linesData);
  // console.log("hue", linesData.h);
  return (
    <div>
      <h2>{title}</h2>
      <ColorRow
        colors={colors}
        labels={axisLabels}
        currentIndex={currentIndex}
      />
      <LineGraph
        title="lightness"
        width={400}
        height={200}
        dataset={linesData.l}
        yDomainMax={150}
        colorArray={colors}
      />
      <LineGraph
        title="chroma"
        width={400}
        height={200}
        dataset={linesData.c}
        yDomainMax={100}
        colorArray={colors}
      />
      <LineGraph
        title="hue"
        width={400}
        height={200}
        dataset={linesData.h}
        yDomainMax={360}
        colorArray={colors}
      />
    </div>
  );
};
