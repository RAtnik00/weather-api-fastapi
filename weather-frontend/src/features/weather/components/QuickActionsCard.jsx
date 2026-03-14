import Card from "../../../components/Card.jsx";

export default function QuickActionsCard({
                                             city,
                                             onAddFavorite,
                                             onRefresh,
                                             isAddingFavorite,
                                         }) {
    const cannotAddFavorite = !city || isAddingFavorite;

    function handleAddFavorite() {
        if (!city) return;
        onAddFavorite(city);
    }

    return (
        <Card title="Quick actions">
            <div className="btnRow">
                <button
                    className="ghostBtn"
                    type="button"
                    onClick={handleAddFavorite}
                    disabled={cannotAddFavorite}
                >
                    {isAddingFavorite ? "Adding..." : "★ Add to favorites"}
                </button>

                <button
                    className="ghostBtn"
                    type="button"
                    onClick={onRefresh}
                >
                    ⟳ Refresh
                </button>
            </div>
        </Card>
    );
}
