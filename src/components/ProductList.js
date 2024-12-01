import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProductList({ shopId, onEdit }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of products per page

  // Fetch products for the selected shop
  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products?shopId=${shopId}`);
      console.log('Fetched products:', response.data); // Debug log
      setProducts(response.data);
      setFilteredProducts(response.data); // Initialize filtered products
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchProducts();
    }
  }, [shopId]);

  // Search and Filter Logic
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    // Filter by stock level
    if (stockFilter) {
      filtered = filtered.filter((product) => {
        if (stockFilter === 'in-stock') return product.stock > 5;
        if (stockFilter === 'low-stock') return product.stock > 0 && product.stock <= 5;
        if (stockFilter === 'out-of-stock') return product.stock === 0;
        return true;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchTerm, priceFilter, stockFilter, products]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <h3>Product List</h3>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Dropdowns */}
      <div>
        <label htmlFor="price-filter">Filter by Price:</label>
        <select
          id="price-filter"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="">All Prices</option>
          <option value="0-50">0-50</option>
          <option value="51-100">51-100</option>
          <option value="101-200">101-200</option>
        </select>

        <label htmlFor="stock-filter">Filter by Stock Level:</label>
        <select
          id="stock-filter"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="">All Stock Levels</option>
          <option value="in-stock">In Stock (6+)</option>
          <option value="low-stock">Low Stock (1-5)</option>
          <option value="out-of-stock">Out of Stock (0)</option>
        </select>
      </div>

      {/* Paginated Product List */}
      {currentProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        currentProducts.map((product) => (
          <div key={product.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <h4>{product.name}</h4>
            <p>Price: {product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Description: {product.description}</p>
            <button onClick={() => onEdit(product)}>Edit</button>
            <button onClick={() => api.delete(`/products/${product.id}`).then(fetchProducts)}>Delete</button>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
