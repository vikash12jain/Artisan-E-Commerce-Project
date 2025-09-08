const ProductCard = ({ product }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <div className="w-full h-64 overflow-hidden">
      <img
        src={`https://placehold.co/400x400/a855f7/ffffff?text=${product.name.replace(/ /g, '+')}`}
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4">
      <p className="text-gray-500 text-sm mt-1">{product.category}</p>
      <h3 className="text-lg font-semibold text-gray-800 mt-2">{product.name}</h3>
      <div className="flex items-center justify-between mt-4">
        <span className="text-xl font-bold text-gray-800">${product.price}</span>
        <button className="bg-purple-600 text-white font-medium py-2 px-4 rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-md">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

export default ProductCard;
