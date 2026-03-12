import Card from "./Card";

export default function FavoritesCard({
                                          favoritesQ,
                                          onSelectCity,
                                          onRemoveFavorite,
                                          removingCity,
                                      }) {
    return (
        <Card title="Favorites">
            {favoritesQ.isLoading ? (
                <div className="muted">Loading…</div>
            ) : favoritesQ.isError ? (
                <div className="error">
                    Error: {String(favoritesQ.error?.message || favoritesQ.error)}
                </div>
            ) : favoritesQ.data?.length ? (
                <div className="listCol">
                    {favoritesQ.data.map((city) => (
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
                                disabled={removingCity === city}
                            >
                                {removingCity === city ? "Removing..." : "Delete"}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="muted">No favorites yet</div>
            )}
        </Card>
    );
}