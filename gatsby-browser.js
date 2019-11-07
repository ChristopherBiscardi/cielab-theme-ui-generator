const ReactDOM = require("react-dom");
exports.replaceHydrateFunction = () => {
  return (element, container, callback) => {
    console.log("rendering!", element);
    ReactDOM.createRoot(container).render(element, callback);
  };
};
