import React, { useEffect, useState } from "react";
import { CONSTANTS } from "../../utils/constants";

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
        const response = await fetch(CONSTANTS.PRODUCTS_URL("/"));
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
        <label htmlFor="category">{CONSTANTS.CATEGORY}</label>
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
        <label htmlFor="minRating">{CONSTANTS.MIN_RATING}</label>
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
        <label htmlFor="sort">{CONSTANTS.SORT_BY}</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">{CONSTANTS.NONE}</option>
          <option value="price-low-high">{CONSTANTS.PRICE_LOW_TO_HIGH}</option>
          <option value="price-high-low">{CONSTANTS.PRICE_HIGH_TO_LOW}</option>
          <option value="rating-high-low">{CONSTANTS.RATING_HIGH_TO_LOW}</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFiltersSorting;
