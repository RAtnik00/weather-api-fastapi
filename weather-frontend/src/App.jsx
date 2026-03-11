import { useState } from "react";
import {
    useAddFavorite,
    useCurrentWeather,
    useFavorites,
    useForecast,
    useHistory,
    useRemoveFavorite,
} from "./services/useWeather";
import SearchBar from "./components/SearchBar";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import ForecastCard from "./components/ForecastCard";
import HistoryCard from "./components/HistoryCard";
import FavoritesCard from "./components/FavoritesCard";
import QuickActionsCard from "./components/QuickActionsCard";
import "./App.css";

export default function App() {
    const [input, setInput] = useState("Warsaw");
    const [city, setCity] = useState("Warsaw");

    const currentQ = useCurrentWeather(city);
    const forecastQ = useForecast(city);
    const historyQ = useHistory();
    const favoritesQ = useFavorites();

    const addFavoriteM = useAddFavorite();
    const removeFavoriteM = useRemoveFavorite();

    const handleSearch = () => {
        const nextCity = input.trim();
        if (!nextCity) return;
        setCity(nextCity);
    };

    const handleSelectCity = (nextCity) => {
        setInput(nextCity);
        setCity(nextCity);
    };

    const handleAddFavorite = (targetCity) => {
        const nextCity = targetCity?.trim();
        if (!nextCity) return;
        addFavoriteM.mutate(nextCity);
    };

    const handleRemoveFavorite = (targetCity) => {
        removeFavoriteM.mutate(targetCity);
    };

    const handleRefresh = () => {
        currentQ.refetch();
        forecastQ.refetch();
        historyQ.refetch();
        favoritesQ.refetch();
    };

    return (
        <div className="page">
            <div className="shell">
                <header className="topbar">
                    <div>
                        <div className="h1">Weather</div>
                        <div className="sub">Desktop dashboard</div>
                    </div>

                    <SearchBar
                        input={input}
                        setInput={setInput}
                        onSearch={handleSearch}
                    />
                </header>

                <main className="grid">
                    <section className="colLeft">
                        <CurrentWeatherCard currentQ={currentQ} />

                        <QuickActionsCard
                            city={city}
                            onAddFavorite={handleAddFavorite}
                            onRefresh={handleRefresh}
                            isAddingFavorite={addFavoriteM.isPending}
                        />
                    </section>

                    <section className="rightCol">
                        <ForecastCard forecastQ={forecastQ} />

                        <div className="rightBottom">
                            <HistoryCard
                                historyQ={historyQ}
                                onSelectCity={handleSelectCity}
                            />

                            <FavoritesCard
                                favoritesQ={favoritesQ}
                                onSelectCity={handleSelectCity}
                                onRemoveFavorite={handleRemoveFavorite}
                                removingCity={removeFavoriteM.variables}
                            />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}