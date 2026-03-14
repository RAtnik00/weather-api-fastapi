export default function SearchBar({ input, setInput, onSearch }) {
    function handleSubmit(event) {
        event.preventDefault();
        onSearch();
    }

    function handleChange(event) {
        setInput(event.target.value);
    }

    return (
        <form className="search" onSubmit={handleSubmit}>
            <input
                type="text"
                className="searchInput"
                value={input}
                onChange={handleChange}
                placeholder="Search location (e.g., Warsaw)"
                aria-label="Search location"
            />

            <button className="searchBtn" type="submit">
                Search
            </button>
        </form>
    );
}
