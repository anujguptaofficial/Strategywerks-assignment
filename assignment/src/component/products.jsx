import { useEffect, useState } from "react";

import { CONSTANTS } from "../utils/constants";
import ProductDetailsModal from "../modal/productsModal";
import "./products.css"

const Products = () => {
  const [products, setProducts] = useState([]);
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

  return (
    <div className="product-page">
      <h1 className="title">Products</h1>
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
          </div>
        ))}
      </div>
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
