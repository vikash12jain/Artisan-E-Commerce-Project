// src/Pages/HomePage.jsx
import ProductCard from "../Component/ProductCard";

const HomePage = ({ products, isLoading }) => (
  <main className="flex-grow container mx-auto p-8">
    <div className="text-center my-8">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to Artisan Crafts</h1>
      <p className="mt-2 text-lg text-gray-600">Explore our amazing handcrafted goods!</p>
    </div>

    {/* New Arrivals */}
    <section className="my-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="text-center col-span-full text-gray-500">Loading products...</p>
        ) : (
          products.slice(0, 4).map(product => <ProductCard key={product._id} product={product} />)
        )}
      </div>
    </section>

    {/* Top Selling */}
    <section className="my-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Top Selling</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="text-center col-span-full text-gray-500">Loading products...</p>
        ) : (
          products.slice(4, 8).map(product => <ProductCard key={product._id} product={product} />)
        )}
      </div>
    </section>

    {/* Browse by Craft */}
    <section className="my-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Browse by Craft</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <img src="https://placehold.co/200x200/a855f7/ffffff?text=Pottery" alt="Pottery" className="rounded-full w-32 h-32 object-cover mb-4" />
          <h3 className="text-lg font-semibold">Handmade Pottery</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <img src="https://placehold.co/200x200/fca5a5/ffffff?text=Jewelry" alt="Jewelry" className="rounded-full w-32 h-32 object-cover mb-4" />
          <h3 className="text-lg font-semibold">Artisan Jewelry</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <img src="https://placehold.co/200x200/93c5fd/ffffff?text=Textiles" alt="Textiles" className="rounded-full w-32 h-32 object-cover mb-4" />
          <h3 className="text-lg font-semibold">Woven Textiles</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <img src="https://placehold.co/200x200/a78bfa/ffffff?text=Woodworks" alt="Woodworks" className="rounded-full w-32 h-32 object-cover mb-4" />
          <h3 className="text-lg font-semibold">Fine Woodworks</h3>
        </div>
      </div>
    </section>
  </main>
);

export default HomePage;
