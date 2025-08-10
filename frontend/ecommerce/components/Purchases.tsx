import React, { useEffect, useState } from "react";
import API from "../services/apiConfig";
import { useAppSelector } from "../hooks";

interface Purchase {
  id: number;
  buyer_name: string;
  order_code: string;
  product: string;
  quantity: number;
  price: number;
  order_date: string;
  order_status: string;
  delivery_location: string;
  landmark: string;
  seller_name?: string;
}

export default function Purchases() {
  const auth = useAppSelector((state) => state.auth);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = auth.role === "ADMIN";

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.getSellerPurchases();
        setPurchases(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || "Failed to load purchases");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const totalAmount = purchases.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  if (loading) return <p>Loading purchases...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (purchases.length === 0) return <p>No purchases found.</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="mb-4">Purchases</h2>
      <div className="overflow-auto max-h-[500px] border rounded">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Buyer Name</th>
              <th>Order Code</th>
              <th>Product</th>
              <th className="text-center">Quantity</th>
              <th className="text-end">Price per Quantity</th>
              <th>Order Date</th>
              <th>Order Status</th>
              <th>Delivery Location</th>
              <th>Landmark</th>
              {isAdmin && <th>Seller Name</th>}
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td>{p.buyer_name}</td>
                <td>{p.order_code}</td>
                <td>{p.product}</td>
                <td className="text-center">{p.quantity}</td>
                <td className="text-end">{p.price.toFixed(2)}</td>
                <td>{new Date(p.order_date).toLocaleString()}</td>
                <td>{p.order_status}</td>
                <td>{p.delivery_location}</td>
                <td>{p.landmark}</td>
                {isAdmin && <td>{p.seller_name ?? "N/A"}</td>}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="fw-bold" colSpan={isAdmin ? 4 : 3}>
                Totals
              </td>
              <td className="text-end fw-bold">{totalAmount.toFixed(2)}</td>
              <td colSpan={isAdmin ? 5 : 6}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
