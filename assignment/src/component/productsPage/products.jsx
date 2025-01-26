import { useEffect, useState } from "react";

import { CONSTANTS } from "../../utils/constants";
import ProductDetailsModal from "../../modal/productsModal";
import "./products.css"
import ProductFiltersSorting from "../productFilters/productFilters";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const productsPerPage = 5;
  const maxId = 20;

  useEffect(() => {
    const fetchProductsBatch = async (startId, endId) => {
      setIsLoading(true);
      setError(null);
      try {
        const productRequests = [];
        for (let id = startId; id <= endId; id++) {
          const productUrl = CONSTANTS.PRODUCTS_URL(id);
          productRequests.push(fetch(productUrl));
        }
        const responses = await Promise.all(productRequests);
        const validResponses = responses.filter((res) => res.status === 200);
        const products = await Promise.all(validResponses.map((res) => res.json()));
        if (products.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prev) => [...prev, ...products]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (hasMore) {
      const startId = (currentPage - 1) * productsPerPage + 1;
      const endId = Math.min(currentPage * productsPerPage, maxId);
      fetchProductsBatch(startId, endId);
    }
  }, [currentPage, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!isLoading && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleFilterChange = (filters) => {
    let filtered = [...products];
    if (filters.category !== "all") {
      filtered = filtered.filter((product) => product.category === filters.category);
    }
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    filtered = filtered.filter((product) => product.rating.rate >= filters.minRating);
    setFilteredProducts(filtered);
  };

  const handleSortChange = (sortOption) => {
    let sortedProducts = [...filteredProducts];
    if (sortOption === "price-low-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating-high-low") {
      sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    setFilteredProducts(sortedProducts);
  };

  return (
    <div>
      <header className="products-header">
        <h1 className="products-title">Our Featured Products</h1>
      </header>
      {/* <ProductFiltersSorting
      onFilterChange={handleFilterChange}
      onSortChange={handleSortChange}
      /> */}
      {error && <p className="error">{error}</p>}
      <div className="product-container">
        {products.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="product-box"
            onClick={() => openModal(product)}
          >
            <h3
              title={product.title}
            >
              {product.title}
            </h3>
            <img
              src={product.image}
              alt={product.title}
            />
            <p>
              {CONSTANTS.PRICE$} {product.price}
            </p>
            <p>Rating: {product.rating.rate} ⭐</p>
          </div>
        ))}
      </div>
      {/* <div className="product-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-box">
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>{product.category}</p>
              <p>${product.price.toFixed(2)}</p>
              <p>Rating: {product.rating.rate} ⭐</p>
            </div>
          ))
        ) : (
          <p className="no-products">No products match the selected filters.</p>
        )}</div> */}
      {isLoading && <div>{CONSTANTS.LOADING}</div>}
      {!hasMore && <h3 className="no-products">{CONSTANTS.NO_MORE_PRODUCTS}</h3>}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Products;
