import { useState, useEffect } from 'react';
import HomePage from '../Pages/Home';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentPage === 'home') {
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products');
          const data = await response.json();
          setProducts(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage products={products} isLoading={isLoading} />;
      case 'login': return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'register': return <RegisterPage setCurrentPage={setCurrentPage} />;
      default: return <HomePage products={products} isLoading={isLoading} />;
    }
  };

  return (
   <div className="min-h-screen flex flex-col font-sans">
    {/* Navbar */}
    <header className="bg-stone-800 shadow-md">
        <div className="container mx-auto px-9 flex justify-between items-center">
            <a href="#" className="text-amber-100 text-2xl font-serif font-bold tracking-widest m-4">ARTISAN</a>
            <nav className='flex items-center gap-x-6'>
             <button className='text-amber-100 border border-1 rounded-full px-3 py-1 m-0'> <span className='pr-40'>Search</span></button>
                <ul className="flex space-x-6 text-amber-100 m-4">
                    <li><a href="#" onClick={() => setCurrentPage('home')} className="hover:text-amber-300 font-medium transition-colors">Home</a></li>
                    <li><a href="#" onClick={() => setCurrentPage('home')} className="hover:text-amber-300 font-medium transition-colors">Shop</a></li>
                    <li><a href="#" className="hover:text-amber-300 font-medium transition-colors">Admin</a></li>
                    <li><a href="#" className="hover:text-amber-300 font-medium transition-colors">Login</a></li>
                </ul>
            </nav>
        </div>
    </header>

    {/* Hero Section */}
    {currentPage === 'home' && (
        <div className="relative w-full h-92 sm:h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden">
            <img src="https://media.craftmaestros.com/media/magefan_blog/Elevate_Your_Home_Decor_With_Craft_Maestros.jpg" alt="Hero" className="absolute top-[-220px] w-full h-[calc(100% + 200px)] object-contain" />
            <div className="absolute inset-0 bg-stone-900/40  flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-3xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-4 leading-tight tracking-wide">Handcrafted Goods for a Thoughtful Home</h1>
                    <p className="text-base sm:text-lg md:text-xl font-light mb-8 max-w-xl mx-auto">Discover our curated collection of unique items made with intention by skilled artisans.</p>
                    <button onClick={() => setCurrentPage('home')} className="bg-amber-100 text-stone-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition-colors shadow-lg">Explore the Collection</button>
                </div>
            </div>
        </div>
    )}

    {/* Current Page */}
    {renderPage()}

    {/* Footer */}
    <footer className="bg-stone-900 text-amber-100 py-12 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 className="text-xl font-bold font-serif text-white mb-4">ARTISAN</h3>
                <p>A marketplace for unique artisanal goods, crafted with passion.</p>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                <ul>
                    <li><a href="#" className="hover:text-amber-300 transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-amber-300 transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-amber-300 transition-colors">FAQ</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
                <ul>
                    <li><a href="#" className="hover:text-amber-300 transition-colors">Pottery</a></li>
                    <li><a href="#" className="hover:text-amber-300 transition-colors">Jewelry</a></li>
                    <li><a href="#" className="hover:text-amber-300 transition-colors">Textiles</a></li>
                    <li><a href="#" className="hover:text-amber-300 transition-colors">Woodworks</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-amber-300 transition-colors">FB</a>
                    <a href="#" className="hover:text-amber-300 transition-colors">IG</a>
                    <a href="#" className="hover:text-amber-300 transition-colors">TW</a>
                </div>
            </div>
        </div>
        <div className="text-center mt-8 pt-4 border-t border-gray-700">
            <p className="text-sm">&copy; 2024 ARTISAN. All rights reserved.</p>
        </div>
    </footer>
</div>
  );
};

export default App;
