import Card from "../../../components/Card.jsx";

export default function FavoritesCard({
                                          favoritesQ,
                                          onSelectCity,
                                          onRemoveFavorite,
                                          removingCity,
                                      }) {
    const favorites = favoritesQ.data ?? [];

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

    if (!favorites.length) {
        return (
            <Card title="Favorites">
                <div className="muted">No favorites yet</div>
            </Card>
        );
    }

    return (
        <Card title="Favorites">
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
                                disabled={removing}
                            >
                                {removing ? "Removing..." : "Delete"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
