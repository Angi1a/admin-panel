import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function ProductForm({ currentProduct, onSuccess, shopId }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (currentProduct) {
      reset(currentProduct); // Populate form with current product details
    }
  }, [currentProduct, reset]);

  const onSubmit = async (data) => {
    try {
      if (currentProduct) {
        // Update the product
        await api.put(`/products/${currentProduct.id}`, data);
        console.log('Product updated successfully!');
      } else {
        // Add a new product
        data.shopId = shopId; // Link product to shop
        await api.post('/products', data);
        console.log('Product added successfully!');
      }
      reset();
      onSuccess(); // Notify parent component
    } catch (error) {
      console.error('Error saving product:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', { required: true })}
        placeholder="Product Name"
      />
      <input
        {...register('price', { required: true })}
        type="number"
        placeholder="Price"
      />
      <input
        {...register('stock', { required: true })}
        type="number"
        placeholder="Stock Level"
      />
      <textarea
        {...register('description')}
        placeholder="Description"
      ></textarea>
      <button type="submit">
        {currentProduct ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}
