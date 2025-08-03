import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchProducts } from "../features/productsSlice";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import Header from "../components/Header";
import SortSelect from "../components/SortSelect";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, status, page, hasMore } = useAppSelector((state) => state.products);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");

  // Initial load
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, filters: { ...filters, sort } }));
  }, [dispatch, filters, sort]);

  const loadMore = useCallback(() => {
    if (status !== "loading") {
      dispatch(fetchProducts({ page: page + 1, filters: { ...filters, sort } }));
    }
  }, [dispatch, page, filters, sort, status]);

  const lastProductRef = useInfiniteScroll(loadMore, hasMore, status === "loading");

  return (
    <div>
      <Header />
      <main className="flex flex-col md:flex-row p-4 gap-4">
        <Filters />
        <section className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Product Catalog</h2>
            <SortSelect value={sort} onChange={setSort} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((product, index) =>
              index === items.length - 1 ? (
                <div ref={lastProductRef} key={product.id}>
                  <ProductCard product={product} />
                </div>
              ) : (
                <ProductCard key={product.id} product={product} />
              )
            )}
          </div>
          {status === "loading" && <p className="mt-4 text-center">Loading more...</p>}
          {!hasMore && <p className="mt-4 text-center text-gray-500">No more products.</p>}
        </section>
      </main>
    </div>
  );
}
