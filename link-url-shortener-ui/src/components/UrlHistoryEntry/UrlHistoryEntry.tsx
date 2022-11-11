import ButtonChoices from "../ButtonChoices/ButtonChoices";
import "./UrlHistoryEntry.scss";

const UrlHistoryEntry = ({ url }: any) => {
  return (
    <div className="url-history-entry-ctr">
      <div>
        <strong className="alias-header">
          <a href={url.alias}>{url.alias}</a>
        </strong>
      </div>
      <div>
        <small className="original-url-subheader">{url.originalURL}</small>
      </div>
      <ButtonChoices url={url} />
    </div>
  );
};

export default UrlHistoryEntry;
