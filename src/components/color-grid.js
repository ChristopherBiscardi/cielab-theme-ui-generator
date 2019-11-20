import React , {useRef, useEffect} from 'react'

const ColorGrid = ({ setCurrentColor, currentColor }) => {
    const currentButton = useRef();
    useEffect(() => {
      // console.log(currentButton);
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
                {state.grid[name].map((colorAsTuple, i) => {
                  const color = hpluvToHex(colorAsTuple)
  
                  const bestColor = bestContrast(color, [
                    hpluvToHex(state.grid.Gray[0]),
                    hpluvToHex(state.grid.Gray[state.grid.Gray.length - 1])
                  ]);
                  const bestColorContrast = getContrastRatio(
                    color,
                    bestColor
                  );
                  return (
                    <td
                      key={name + "-" + color + "-" + i}
                      sx={{ padding: 0, lineHeight: 0 }}
                    >
                      <button
                        ref={
                          name === currentColor.name && currentColor.index === i
                            ? currentButton
                            : null
                        }
                        sx={{
                          backgroundColor: color,
                          border: `2px solid ${
                            name === currentColor.name && currentColor.index === i
                              ? "white"
                              : color
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