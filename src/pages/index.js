/** @jsx jsx */
import { useState } from "react";
import { jsx } from "theme-ui";
import { lab } from "d3-color";
import LineGraph from "../components/line-chart";

const lightnessScale = [
  98.2,
  92.2,
  80.8,
  69.1,
  59.9,
  47.1,
  36.0,
  28.1,
  19.9,
  12.3
];
const colorLabels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const colors = {
  Gray: [0, 0],
  Blue: [0, -160],
  Cyan: [-80, -80],
  Green: [-160, 0],
  Yellow: [0, 160],
  Orange: [0, 80],
  Red: [160, 0],
  Purple: [0, 0],
  Violet: [0, 0]
};
const state = {
  grid: Object.entries(colors).reduce(
    (acc, [colorName, ab]) => ({
      ...acc,
      [colorName]: Array.from({ length: 10 }).map((v, i) =>
        lab(lightnessScale[i], ab[0], ab[1])
      )
    }),
    {}
  )
};

export default props => {
  const [currentColor, setCurrentColor] = useState({ name: "Gray", index: 4 });
  return (
    <div sx={{ display: "flex" }}>
      <ColorPicker />
      <ColorGrid setCurrentColor={setCurrentColor} />
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

const ColorGrid = ({ setCurrentColor }) => {
  return (
    <div>
      <table>
        <caption>ColorGrid</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            {colorLabels.map(label => (
              <th scope="col" key={label}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.keys(colors).map(name => (
            <tr key={name}>
              <th scope="row" key={name}>
                {name}
              </th>
              {state.grid[name].map((labColor, i) => (
                <td key={name + "-" + labColor + "-" + i}>
                  <button
                    sx={{ backgroundColor: labColor.formatRgb() }}
                    onClick={() => {
                      setCurrentColor({ name, index: i });
                    }}
                  >
                    {i}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const ColorRow = ({ colors, labels, currentIndex }) => (
  <div sx={{ padding: "1rem", display: "flex" }}>
    {colors.map((labColor, i) => (
      <div sx={{ display: "flex", flexDirection: "column" }}>
        <span sx={{ fontSize: "12px" }}>{labels[i]}</span>
        <button
          key={i}
          sx={{
            backgroundColor: labColor.formatRgb(),
            height: "20px",
            width: "20px",
            border: "1px solid transparent",
            borderColor: i === currentIndex ? "red" : "transparent"
          }}
        >
          <span sx={{ display: "none" }}>{labColor.formatRgb()}</span>
        </button>
      </div>
    ))}
  </div>
);

const ColorColumn = ({ title, colors, axisLabels, currentIndex }) => (
  <div>
    <h2>{title}</h2>
    <ColorRow colors={colors} labels={axisLabels} currentIndex={currentIndex} />
    <LineGraph />
  </div>
);
