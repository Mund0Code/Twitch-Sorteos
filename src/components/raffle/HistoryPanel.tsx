import {
  exportHistoryToCSV,
  exportHistoryToJSON,
} from "../../utils/exportHistory";

type Raffle = {
  id: string;
  title: string;
  prize: string;
  createdAt: string;
  participants: string[];
  winner?: string;
};

export function HistoryPanel(props: { history: Raffle[] }) {
  return (
    <div className="history">
      <div className="historyHeader">
        <div style={{ fontWeight: 900 }}>Historial</div>

        <div className="historyActions">
          <button
            className="btnSecondary"
            disabled={props.history.length === 0}
            onClick={() => exportHistoryToCSV(props.history)}
          >
            📄 CSV
          </button>

          <button
            className="btnSecondary"
            disabled={props.history.length === 0}
            onClick={() => exportHistoryToJSON(props.history)}
          >
            📦 JSON
          </button>
        </div>
      </div>

      {props.history.length === 0 ? (
        <div style={{ opacity: 0.65, fontSize: 13 }}>
          Todavía no hay sorteos guardados.
        </div>
      ) : (
        <div className="historyList">
          {props.history.map((h) => (
            <div key={h.id} className="historyItem">
              <div style={{ fontWeight: 800 }}>
                {h.title} {h.prize ? `· ${h.prize}` : ""}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Ganador: <b>{h.winner ?? "—"}</b> ·{" "}
                {new Date(h.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
