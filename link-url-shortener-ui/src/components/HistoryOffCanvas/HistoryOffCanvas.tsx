import React from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { useDeleteUrlHistory } from "../../common/apiCalls/urls/urls";
import { AppThemeContext } from "../../context/AppThemeContext";
import { LayoutContext } from "../../context/LayoutContext";
import SearchFilter from "../SearchFilter/SearchFilter";
import SuccessToast from "../SuccessToast/SuccessToast";
import UrlHistoryEntry from "../UrlHistoryEntry/UrlHistoryEntry";
import "./HistoryOffCanvas.scss";

const HistoryOffCanvas = ({ aggregatedHistory }: any) => {
  const [showClearHistoryToast, setShowClearHistoryToast] =
    React.useState(false);

  const { historyCanvas, hideHistoryCanvas } = React.useContext(LayoutContext);
  const { appTheme } = React.useContext(AppThemeContext);

  const [searchText, setSearchText] = React.useState<string>("");

  const deleteHistory = useDeleteUrlHistory();

  const handleDeleteHistory = () => {
    deleteHistory.mutate();
    if (deleteHistory.isSuccess) {
    }
    setShowClearHistoryToast(true);
  };

  // Reset search bar value when opening and closing this canvas
  React.useEffect(() => {
    setSearchText("");
  }, [historyCanvas]);

  const filteredAggregatedResults = React.useMemo(() => {
    // if empty input
    if (!searchText) return aggregatedHistory;

    return aggregatedHistory.filter((h: any) => {
      const foundSearchMatch = (str: string, searchedStr: string) => {
        // -1 indicates could not find match in string
        return str.toLowerCase().search(searchedStr.toLowerCase()) !== -1;
      };

      return (
        foundSearchMatch(h.alias, searchText) ||
        foundSearchMatch(h.originalURL, searchText)
      );
    });
  }, [searchText, aggregatedHistory]);

  return (
    <Offcanvas
      className={`history-off-canvas-ctr ${appTheme}`}
      show={historyCanvas}
      onHide={hideHistoryCanvas}
      placement="end"
    >
      <div className="history-off-canvas-top-section">
        <SuccessToast
          show={showClearHistoryToast}
          onClose={() => setShowClearHistoryToast(false)}
          text={"Cleared history"}
        />
        <Offcanvas.Header
          closeButton
          closeVariant="black"
          className="history-off-canvas-header p-2 pt-3 pe-3"
        >
          <Button onClick={handleDeleteHistory}>Clear History</Button>
        </Offcanvas.Header>

        <Offcanvas.Title>
          <div className="py-3 px-4">
            <div className="d-flex justify-content-between top-section-main-text">
              Your Shortened URL History
            </div>
            <div>
              <SearchFilter value={searchText} setText={setSearchText} />
            </div>
          </div>
        </Offcanvas.Title>
      </div>
      <Offcanvas.Body>
        {!!aggregatedHistory.length ? (
          <>
            {filteredAggregatedResults
              ?.map((h: any) => {
                return (
                  <React.Fragment key={h.alias}>
                    <UrlHistoryEntry url={h} />
                  </React.Fragment>
                );
              })
              .reverse()}
            <div>
              {" "}
              {!!filteredAggregatedResults?.length
                ? "No More Links!"
                : "No Matching Links!"}
            </div>
          </>
        ) : (
          <div> No URLs shortened!</div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default HistoryOffCanvas;
