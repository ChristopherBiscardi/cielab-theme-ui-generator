const ReactDOM = require("react-dom");
exports.replaceHydrateFunction = () => {
  return (element, container, callback) => {
    ReactDOM.createRoot(container, {
      hydrate: true,
    }).render(element, callback);
  };
};
