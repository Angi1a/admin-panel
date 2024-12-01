import { useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

export default function ProductManagement({ shopId }) {
    const [currentProduct, setCurrentProduct] = useState(null);
  
    const handleProductAddedOrUpdated = () => {
      console.log('Product added or updated successfully!');
      setCurrentProduct(null); // Clear form after success
    };
  
    return (
      <div>
        <h2>Manage Products</h2>
        <ProductForm
          currentProduct={currentProduct}
          shopId={shopId}
          onSuccess={handleProductAddedOrUpdated}
        />
        <ProductList
          shopId={shopId}
          onEdit={(product) => setCurrentProduct(product)}
        />
      </div>
    );
  }