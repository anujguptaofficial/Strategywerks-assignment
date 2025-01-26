import React, { useEffect, useState } from "react";

const ProductFiltersSorting = ({ onFilterChange, onSortChange }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    minRating: 0,
  });
  const [error, setError] = useState("")
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        const uniqueCategories = ["all", ...new Set(data.map((p) => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        setError("Something went wrong, page you are looking might have been to moved: ", error.message)
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    onSortChange(newSortOption);
  };

  return (
    <div className="filters">
      <div className="filter">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) =>
            handleFilterChange({ ...filters, category: e.target.value })
          }
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="priceRange">Price Range:</label>
        <input
          type="range"
          id="priceRange"
          min="0"
          max="1000"
          step="10"
          value={filters.priceRange[1]}
          onChange={(e) =>
            handleFilterChange({
              ...filters,
              priceRange: [0, Number(e.target.value)],
            })
          }
        />
        <span>${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
      </div>

      <div className="filter">
        <label htmlFor="minRating">Minimum Rating:</label>
        <input
          type="number"
          id="minRating"
          min="0"
          max="5"
          step="0.1"
          value={filters.minRating}
          onChange={(e) =>
            handleFilterChange({
              ...filters,
              minRating: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="filter">
        <label htmlFor="sort">Sort By:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">None</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating-high-low">Rating: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFiltersSorting;
