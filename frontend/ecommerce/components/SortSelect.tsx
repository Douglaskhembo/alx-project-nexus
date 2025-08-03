interface SortProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SortSelect({ value, onChange }: SortProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 text-sm"
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}
