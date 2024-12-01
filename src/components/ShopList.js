import React, { useState, useEffect } from 'react'; // Add useState and useEffect here
import api from '../services/api';
export default function ShopList({ onEdit }) {
  console.log('onEdit prop:', onEdit); // Debug log

  const [shops, setShops] = useState([]);

  const fetchShops = async () => {
    try {
      const response = await api.get('/shops');
      console.log('Fetched Shops:', response.data); // Debug log
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error.message);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div>
      <h3>Shop List</h3>
      {shops.map((shop) => (
        <div key={shop.id} style={{ marginBottom: '10px' }}>
          <h4>{shop.name}</h4>
          <p>{shop.description}</p>
          <button
            onClick={() => {
              console.log('Edit button clicked for shop:', shop); // Debug log
              onEdit(shop); // Directly invoke onEdit without default fallback
            }}
          >
            Edit
          </button>
          <button onClick={() => console.log('Deleting shop:', shop.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
