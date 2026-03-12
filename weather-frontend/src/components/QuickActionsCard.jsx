import Card from "./Card";

export default function QuickActionsCard({
                                             city,
                                             onAddFavorite,
                                             onRefresh,
                                             isAddingFavorite,
                                         }) {
    return (
        <Card title="Quick actions">
            <div className="btnRow">
                <button
                    className="ghostBtn"
                    type="button"
                    onClick={() => onAddFavorite(city)}
                    disabled={!city || isAddingFavorite}
                >
                    {isAddingFavorite ? "Adding..." : "★ Add to favorites"}
                </button>

                <button className="ghostBtn" type="button" onClick={onRefresh}>
                    ⟳ Refresh
                </button>
            </div>
        </Card>
    );
}