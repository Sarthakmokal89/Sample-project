import React from 'react';
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import { ProductsIcon } from '../components/Icons';

const Products: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Products</h1>
      <div className="mt-16 flex flex-col items-center text-center">
        <ProductsIcon className="w-16 h-16 text-violet-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-300">Product Management Coming Soon</h2>
        <p className="text-gray-500 mt-2 max-w-md">This section is under construction. Soon you'll be able to manage and analyze feedback related to specific products.</p>
      </div>
    </div>
  );
};

export default Products;
