import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { usePostShortenLink } from "../../common/apiCalls/shorten/shorten";
import { useGetUrlHistory } from "../../common/apiCalls/urls/urls";
import AgreementText from "../AgreementText/AgreementText";
import CreateShortenedURLForm from "../Forms/ShortURLForm/CreateShortURLForm/CreateShortURLForm";
import ShortURLResultsForm from "../Forms/ShortURLResultsForm/ShortURLResultsForm";
import HistoryOffCanvas from "../HistoryOffCanvas/HistoryOffCanvas";
import WelcomeText from "../WelcomeText/WelcomeText";

const Home = () => {
  const [aggregatedHistory, setAggregatedHistory] = React.useState<any>([]);
  const [alreadyGeneratedShortLink, setAlreadyGeneratedShortLink] =
    React.useState<any>(null);

  const postShortenLink = usePostShortenLink();
  // const getCookie = useGetCookie();

  const { data: urlHistory, isSuccess: gotUrlHistory } = useGetUrlHistory();

  // When we got the initial history from the api, update aggregated history
  React.useEffect(() => {
    if (gotUrlHistory) {
      setAggregatedHistory(urlHistory.data);
    }
  }, [gotUrlHistory, urlHistory?.data]);

  // when we successfully shorten a URL, update aggregated history with new entry
  React.useEffect(() => {
    if (!postShortenLink.isIdle && postShortenLink.isSuccess) {
      setAggregatedHistory((prev: any) => [...prev, postShortenLink.data.data]);
    }
  }, [postShortenLink.isSuccess, postShortenLink.isIdle, postShortenLink.data]);

  return (
    <>
      <HistoryOffCanvas aggregatedHistory={aggregatedHistory} />
      <Row className="mt-5">
        <Col lg="7">
          {!postShortenLink.isSuccess && !alreadyGeneratedShortLink && (
            <CreateShortenedURLForm
              postShortenLink={postShortenLink}
              aggregatedHistory={aggregatedHistory}
              setAlreadyGeneratedShortLink={setAlreadyGeneratedShortLink}
            />
          )}
          {(postShortenLink.isSuccess || alreadyGeneratedShortLink) && (
            <ShortURLResultsForm
              postShortenLink={postShortenLink}
              alreadyGeneratedShortLink={alreadyGeneratedShortLink}
              setAlreadyGeneratedShortLink={setAlreadyGeneratedShortLink}
            />
          )}
          <AgreementText />
        </Col>
        <Col lg="5" className="mt-5 mt-lg-0 pt-5 pt-lg-0">
          <WelcomeText />
        </Col>
      </Row>
    </>
  );
};

export default Home;
