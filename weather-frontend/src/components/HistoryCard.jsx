import Card from "./Card";

export default function HistoryCard({ historyQ, onSelectCity }) {
    const history = historyQ.data ?? [];

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

    if (!history.length) {
        return (
            <Card title="History">
                <div className="muted">No history yet</div>
            </Card>
        );
    }

    return (
        <Card title="History">
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
        </Card>
    );
}
