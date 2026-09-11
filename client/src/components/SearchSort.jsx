// SearchSort.jsx — Search and sort controls that send query strings to the API

export default function SearchSort({ search, sort, onSearchChange, onSortChange }) {
  return (
    <div className="search-sort">
      <div className="search-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            className="clear-search"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="sort-wrapper">
        <label htmlFor="sort-select" className="sort-label">Sort by</label>
        <select
          id="sort-select"
          className="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">Default</option>
          <option value="name">Name (A–Z)</option>
          <option value="price">Price (Low–High)</option>
        </select>
      </div>
    </div>
  );
}
