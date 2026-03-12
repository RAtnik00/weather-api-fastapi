import Card from "./Card";

export default function HistoryCard({ historyQ, onSelectCity }) {
    return (
        <Card title="History">
            {historyQ.isLoading ? (
                <div className="muted">Loading…</div>
            ) : historyQ.isError ? (
                <div className="error">
                    Error: {String(historyQ.error?.message || historyQ.error)}
                </div>
            ) : historyQ.data?.length ? (
                <div className="listCol">
                    {historyQ.data.map((city) => (
                        <button
                            key={city}
                            type="button"
                            className="listBtn"
                            onClick={() => onSelectCity(city)}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="muted">No history yet</div>
            )}
        </Card>
    );
}