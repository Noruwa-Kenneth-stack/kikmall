import React from 'react';

interface FavoritesTabsProps {
  activeTab: 'circulars' | 'products';
  onChange: (tab: 'circulars' | 'products') => void;
}

const FavoritesTabs: React.FC<FavoritesTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex ">
      <button
        onClick={() => onChange('circulars')}
        className={`px-4 py-2 font-medium ${
          activeTab === 'circulars' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
        }`}
      >
        Store Favorites
      </button>
      <button
        onClick={() => onChange('products')}
        className={`ml-4 px-4 py-2 font-medium ${
          activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
        }`}
      >
        Product Favorites
      </button>
    </div>
  );
};

export default FavoritesTabs;
