import Card from "../../../components/Card.jsx";

export default function FavoritesCard({
    favoritesQ,
    onSelectCity,
    onRemoveFavorite,
    onClearFavorites,
    removingCity,
    isClearingFavorites,
}) {
    const favorites = favoritesQ.data ?? [];
    const hasFavorites = favorites.length > 0;

    function isRemoving(city) {
        return removingCity === city;
    }

    if (favoritesQ.isLoading) {
        return (
            <Card title="Favorites">
                <div className="muted">Loading…</div>
            </Card>
        );
    }

    if (favoritesQ.isError) {
        return (
            <Card title="Favorites">
                <div className="error">
                    Error: {String(favoritesQ.error?.message || favoritesQ.error)}
                </div>
            </Card>
        );
    }

    return (
        <Card
            title="Favorites"
            action={
                <button
                    className="ghostBtn clearAllBtn"
                    type="button"
                    onClick={onClearFavorites}
                    disabled={isClearingFavorites || !hasFavorites}
                >
                    Clear all
                </button>
            }
        >
            {hasFavorites ? (
                <div className="listCol">
                    {favorites.map((city) => {
                        const removing = isRemoving(city);

                        return (
                            <div className="favoriteRow" key={city}>
                                <button
                                    type="button"
                                    className="listBtn"
                                    onClick={() => onSelectCity(city)}
                                >
                                    {city}
                                </button>

                                <button
                                    type="button"
                                    className="dangerBtn"
                                    onClick={() => onRemoveFavorite(city)}
                                    disabled={removing || isClearingFavorites}
                                >
                                    {removing ? "Removing..." : "Delete"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="muted">No favorites yet</div>
            )}
        </Card>
    );
}
