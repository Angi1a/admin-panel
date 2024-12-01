import { useState, useEffect } from 'react';
import ProductManagement from '../pages/ProductManagement';
import api from '../services/api';

export default function ProductsPage() {
  const [shops, setShops] = useState([]); // To fetch all available shops
  const [selectedShop, setSelectedShop] = useState(null); // Tracks the shop selected for product management

  // Fetch the list of shops from the API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.get('/shops');
        setShops(response.data);
        console.log('Fetched shops:', response.data); // Debug log
      } catch (error) {
        console.error('Error fetching shops:', error.message);
      }
    };

    fetchShops();
  }, []);

  return (
    <div>
      <h1>Manage Products</h1>

      {/* Dropdown to select a shop for product management */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="shop-select">Select a Shop:</label>
        <select
          id="shop-select"
          onChange={(e) =>
            setSelectedShop(shops.find((shop) => shop.id === e.target.value))
          }
          value={selectedShop?.id || ''}
        >
          <option value="" disabled>
            Select a Shop
          </option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      {/* Render ProductManagement only when a shop is selected */}
      {selectedShop ? (
        <div>
          <h2>Managing Products for Shop: {selectedShop.name}</h2>
          <ProductManagement shopId={selectedShop.id} />
        </div>
      ) : (
        <p>Please select a shop to manage its products.</p>
      )}
    </div>
  );
}
