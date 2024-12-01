import { useState } from 'react';
import ShopForm from '../components/ShopForm';
import ShopList from '../components/ShopList';

export default function ShopManagement() {
  const [currentShop, setCurrentShop] = useState(null);

  // Function to handle editing a shop
  const handleEdit = (shop) => {
    console.log('handleEdit called with shop:', shop); // Debug log
    setCurrentShop(shop); // Set the shop to be edited
  };

  // Function to handle when a shop is added or updated
  const handleShopAddedOrUpdated = () => {
    console.log('Shop added or updated successfully!'); // Debug log
    setCurrentShop(null); // Clear the current shop after success
  };

  // Debug log to confirm the onEdit prop is passed correctly
  console.log('Passing handleEdit to ShopList:', handleEdit);

  return (
    <div>
      <h2>Manage Shops</h2>
      {/* ShopForm handles adding and editing shops */}
      <ShopForm currentShop={currentShop} onSuccess={handleShopAddedOrUpdated} />
      {/* ShopList displays the list of shops and allows editing */}
      <ShopList onEdit={handleEdit} />
    </div>
  );
}