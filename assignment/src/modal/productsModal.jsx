import { CONSTANTS } from "../utils/constants";
import "./productsModal.css"


const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-container">
      <div className="product-detail">
        <button
          onClick={onClose}
        >
          ✖
        </button>
        <h2>{product.title}</h2>
        <img
          src={product.image}
          alt={product.title}
        />
        <p>{product.description}</p>
        <p><strong>{CONSTANTS.CATEGORY}</strong> {product.category}</p>
        <p><strong>{CONSTANTS.PRICE}</strong> ${product.price}</p>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
