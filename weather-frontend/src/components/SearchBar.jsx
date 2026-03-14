import { useEffect, useMemo, useRef, useState } from "react";
import { useCitySuggestions } from "../services/useWeather";

const DEBOUNCE_MS = 300;

function buildSuggestionLabel(item) {
    const parts = [item.name];

    if (item.state) {
        parts.push(item.state);
    }

    parts.push(item.country);

    return parts.join(", ");
}

function buildSearchValue(item) {
    if (item.state) {
        return `${item.name},${item.state},${item.country}`;
    }

    return `${item.name},${item.country}`;
}

export default function SearchBar({ input, setInput, onSearch }) {
    const [debouncedInput, setDebouncedInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef(null);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedInput(input.trim());
        }, DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [input]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (!rootRef.current?.contains(event.target)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const suggestionsQ = useCitySuggestions(debouncedInput);

    const suggestions = useMemo(() => {
        const items = Array.isArray(suggestionsQ.data) ? suggestionsQ.data : [];

        return items.map((item) => ({
            ...item,
            label: buildSuggestionLabel(item),
            searchValue: buildSearchValue(item),
        }));
    }, [suggestionsQ.data]);

    useEffect(() => {
        setActiveIndex(suggestions.length > 0 ? 0 : -1);
    }, [suggestions]);

    const shouldShowSuggestions =
        isOpen &&
        debouncedInput.length >= 2 &&
        suggestions.length > 0;

    function handleSubmit(event) {
        event.preventDefault();

        if (shouldShowSuggestions && activeIndex >= 0 && suggestions[activeIndex]) {
            handleSelectSuggestion(suggestions[activeIndex]);
            return;
        }

        setIsOpen(false);
        setActiveIndex(-1);
        onSearch();
    }

    function handleChange(event) {
        setInput(event.target.value);
        setIsOpen(true);
        setActiveIndex(-1);
    }

    function handleFocus() {
        if (input.trim().length >= 2) {
            setIsOpen(true);
        }
    }

    function handleSelectSuggestion(item) {
        setInput(item.label);
        setIsOpen(false);
        setActiveIndex(-1);
        onSearch(item.searchValue);
    }

    function handleKeyDown(event) {
        if (!shouldShowSuggestions) {
            if (event.key === "Enter") {
                return;
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((prev) => {
                if (suggestions.length === 0) return -1;
                return prev < suggestions.length - 1 ? prev + 1 : 0;
            });
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((prev) => {
                if (suggestions.length === 0) return -1;
                return prev > 0 ? prev - 1 : suggestions.length - 1;
            });
            return;
        }

        if (event.key === "Escape") {
            setIsOpen(false);
            setActiveIndex(-1);
        }
    }

    return (
        <div className="searchWrap" ref={rootRef}>
            <form className="search" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="searchInput"
                    value={input}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    placeholder="Search location (e.g., Warsaw)"
                    aria-label="Search location"
                    autoComplete="off"
                />

                <button className="searchBtn" type="submit">
                    Search
                </button>
            </form>

            {isOpen && debouncedInput.length >= 2 && (
                <div className="suggestionsDropdown">
                    {suggestionsQ.isLoading && (
                        <div className="suggestionEmpty">Searching...</div>
                    )}

                    {!suggestionsQ.isLoading && suggestionsQ.isError && (
                        <div className="suggestionEmpty">
                            Failed to load suggestions
                        </div>
                    )}

                    {!suggestionsQ.isLoading &&
                        !suggestionsQ.isError &&
                        suggestions.length === 0 && (
                            <div className="suggestionEmpty">No matches found</div>
                        )}

                    {!suggestionsQ.isLoading &&
                        !suggestionsQ.isError &&
                        suggestions.map((item, index) => (
                            <button
                                key={`${item.searchValue}-${index}`}
                                type="button"
                                className={`suggestionItem ${
                                    index === activeIndex ? "active" : ""
                                }`}
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    handleSelectSuggestion(item);
                                }}
                            >
                                <span className="suggestionMain">{item.name}</span>
                                <span className="suggestionMeta">
                                    {item.state
                                        ? `${item.state}, ${item.country}`
                                        : item.country}
                                </span>
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}