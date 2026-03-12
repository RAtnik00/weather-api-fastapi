export default function SearchBar({ input, setInput, onSearch }) {
    return (
        <form
            className="search"
            onSubmit={(e) => {
                e.preventDefault();
                onSearch();
            }}
        >
            <input
                className="searchInput"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search location (e.g., Warsaw)"
            />
            <button className="searchBtn" type="submit">
                Search
            </button>
        </form>
    );
}