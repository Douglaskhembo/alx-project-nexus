import Link from "next/link";
import { useAppDispatch } from "../hooks";
import { addToCart } from "../features/cartSlice";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  reviews?: number;
  stock: number;
  tags?: string[];
  discount?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <div className="card shadow-sm h-100">
      {product.discount && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
          -{product.discount}%
        </span>
      )}
      <Link href={`/product/${product.id}`}>
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{product.name}</h5>
        {product.rating && (
          <div className="d-flex align-items-center small mb-2">
            <span className="text-warning">
              {/* Star icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.89-.696L7.538.792c.197-.37.73-.37.927 0l2.184 4.156 4.89.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
            </span>
            <span className="text-muted ms-1">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        )}
        <div className="mt-auto">
          <div className="d-flex align-items-baseline mb-2">
            <span className="fs-5 fw-bold text-primary me-2">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="btn btn-primary w-100"
            >
              Add to Cart
            </button>
          ) : (
            <button className="btn btn-secondary w-100" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}