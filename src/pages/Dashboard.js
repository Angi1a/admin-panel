import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalStockLevel: 0,
    totalValue: 0,
  });
  const [stockDistribution, setStockDistribution] = useState([]);
  const [topShops, setTopShops] = useState([]);

  const COLORS = ['#4CAF50', '#FFC107', '#F44336']; // Improved colors for better visualization

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const shopsResponse = await api.get('/shops');
        const productsResponse = await api.get('/products');

        const shops = shopsResponse.data;
        const products = productsResponse.data;

        // Calculate metrics
        const totalShops = shops.length;
        const totalProducts = products.length;
        const totalStockLevel = products.reduce((sum, product) => sum + (product.stock || 0), 0);
        const totalValue = products.reduce(
          (sum, product) => sum + (product.price || 0) * (product.stock || 0),
          0
        );

        // Calculate stock distribution
        const inStock = products.filter((product) => (product.stock || 0) > 5).length;
        const lowStock = products.filter((product) => (product.stock || 0) > 0 && product.stock <= 5).length;
        const outOfStock = products.filter((product) => (product.stock || 0) === 0).length;

        // Calculate top 5 shops by stock level
        const shopStockLevels = shops.map((shop) => {
          const shopProducts = products.filter((product) => product.shopId === shop.id);
          const stockLevel = shopProducts.reduce((sum, product) => sum + (product.stock || 0), 0);
          return { name: shop.name, stockLevel };
        });

        const sortedShops = shopStockLevels
          .sort((a, b) => b.stockLevel - a.stockLevel)
          .slice(0, 5);

        // Update state
        setMetrics({ totalShops, totalProducts, totalStockLevel, totalValue });
        setStockDistribution([
          { name: 'In Stock', value: inStock },
          { name: 'Low Stock', value: lowStock },
          { name: 'Out of Stock', value: outOfStock },
        ]);
        setTopShops(sortedShops);
      } catch (error) {
        console.error('Error fetching metrics:', error.message);
      }
    };

    fetchMetrics();
  }, []);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={14}
      >
        {`${stockDistribution[index].name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Overview Metrics */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Overview Metrics</h3>
        <p>Total Number of Shops: {metrics.totalShops}</p>
        <p>Total Number of Products: {metrics.totalProducts}</p>
        <p>
          Total Value of Products in Shops: $
          {metrics.totalValue ? metrics.totalValue.toFixed(2) : '0.00'}
        </p>
        <p>Total Stock Level: {metrics.totalStockLevel}</p>
      </div>

      {/* Stock Status Distribution */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h3>Stock Status Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={stockDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={renderCustomLabel}
            >
              {stockDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 Shops by Stock Level */}
      <div>
        <h3>Top 5 Shops by Stock Level</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topShops}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stockLevel" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
