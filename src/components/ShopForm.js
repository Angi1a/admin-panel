import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function ShopForm({ currentShop, onSuccess }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (currentShop) {
      console.log('Pre-filling form with shop:', currentShop); // Debug log
      reset(currentShop); // Pre-fill form fields
    }
  }, [currentShop, reset]);

  const onSubmit = async (data) => {
    try {
      if (currentShop) {
        // Update existing shop
        await api.put(`/shops/${currentShop.id}`, data);
        console.log('Shop updated successfully!');
      } else {
        // Add new shop
        await api.post('/shops', data);
        console.log('Shop added successfully!');
      }
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error saving shop:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} placeholder="Shop Name" />
      <textarea {...register('description')} placeholder="Shop Description" />
      <input {...register('logo')} type="file" />
      <button type="submit">{currentShop ? 'Update Shop' : 'Add Shop'}</button>
    </form>
  );
}
