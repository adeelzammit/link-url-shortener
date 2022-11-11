import React from "react";

const LayoutContext = React.createContext({
  historyCanvas: false,
  showHistoryCanvas: () => {},
  hideHistoryCanvas: () => {},
});

// This LayoutProvider determines when to show the history Canvas with the URL history of the anon user...
const LayoutProvider = ({ children }: any) => {
  const [historyCanvas, setHistoryCanvas] = React.useState(false);
  const showHistoryCanvas = () => {
    setHistoryCanvas(true);
  };
  const hideHistoryCanvas = () => {
    setHistoryCanvas(false);
  };

  return (
    <>
      <LayoutContext.Provider
        value={{
          historyCanvas,
          showHistoryCanvas,
          hideHistoryCanvas,
        }}
      >
        {children}
      </LayoutContext.Provider>
    </>
  );
};

export { LayoutContext, LayoutProvider };
