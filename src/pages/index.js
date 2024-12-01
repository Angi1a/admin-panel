import Link from 'next/link';

export default function index() {
  return (
    <div>
      <h1>Welcome to the Admin Panel</h1>
      <p>Use the navigation to manage shops and products.</p>
      <nav>
        <ul>
          <li>
            <Link href="/shops">Manage Shops</Link>
          </li>
          <li>
            <Link href="/products">Manage Products</Link>
          </li>
          <li>
            <Link href="/Dashboard">View Dashboard</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
