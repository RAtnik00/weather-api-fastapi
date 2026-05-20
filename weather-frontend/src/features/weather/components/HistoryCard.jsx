import Card from "../../../components/Card.jsx";

export default function HistoryCard({
    historyQ,
    onSelectCity,
    onClearHistory,
    isClearingHistory,
}) {
    const history = historyQ.data ?? [];
    const hasHistory = history.length > 0;

    function handleSelect(city) {
        onSelectCity(city);
    }

    if (historyQ.isLoading) {
        return (
            <Card title="History">
                <div className="muted">Loading…</div>
            </Card>
        );
    }

    if (historyQ.isError) {
        return (
            <Card title="History">
                <div className="error">
                    Error: {String(historyQ.error?.message || historyQ.error)}
                </div>
            </Card>
        );
    }

    return (
        <Card title="History">
            <button
                className="ghostBtn clearHistoryBtn"
                type="button"
                onClick={onClearHistory}
                disabled={isClearingHistory || !hasHistory}
            >
                Clear history
            </button>

            {hasHistory ? (
                <div className="listCol">
                    {history.map((city) => (
                        <button
                            key={city}
                            type="button"
                            className="listBtn"
                            onClick={() => handleSelect(city)}
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
