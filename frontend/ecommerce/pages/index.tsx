import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchProducts } from "../features/productsSlice";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SortSelect from "../components/SortSelect";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, status, page, hasMore, totalProducts } = useAppSelector((state) => state.products);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, filters, sort }));
  }, [dispatch, filters, sort]);

  const loadMore = useCallback(() => {
    if (status !== "loading" && hasMore) {
      dispatch(fetchProducts({ page: page + 1, filters, sort }));
    }
  }, [dispatch, page, filters, sort, status, hasMore]);

  const lastProductRef = useInfiniteScroll(loadMore, hasMore, status === "loading");

  return (
    <>
      <Header />
      <div className="container-fluid pt-5 mt-5"> {/* mt-5 for fixed header */}
        <div className="row">
          <Sidebar onFilterChange={setFilters} currentFilters={filters} />
          <main className="col-md-9 p-4">
            <section>
              {/* Product Catalog Header */}
              <div className="mb-4">
                <h2 className="h3 fw-bold">Product Catalog</h2>
                <p className="text-muted">Discover amazing products at great prices</p>
              </div>
              {/* Sort & Product Count */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="text-muted small">
                  {totalProducts} products
                </span>
                <SortSelect value={sort} onChange={setSort} />
              </div>
              {/* Product Grid */}
              <div className="row g-4">
                {items.map((product, index) =>
                  index === items.length - 1 ? (
                    <div className="col-12 col-sm-6 col-lg-4" ref={lastProductRef} key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ) : (
                    <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  )
                )}
              </div>
              {/* Loading and "No more products" messages */}
              {status === "loading" && <p className="mt-4 text-center text-muted">Loading more...</p>}
              {!hasMore && items.length > 0 && <p className="mt-4 text-center text-muted">No more products to show.</p>}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}