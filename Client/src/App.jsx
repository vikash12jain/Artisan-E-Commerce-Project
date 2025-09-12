import { useState, useEffect, useRef } from 'react';
import './app.css'
import ProfilePage from '../Pages/Profile'

const API_BASE = import.meta.env.VITE_API_URL;

const Toast = ({ message }) => {
    if (!message) return null;
    return (
        <div className="fixed right-4 bottom-6 z-50">
            <div className="bg-stone-800 text-amber-100 px-4 py-2 rounded shadow-lg">
                {message}
            </div>
        </div>
    );
};

const GlobalLoading = ({ active }) => {
    if (!active) return null;
    return (
        <div
            aria-hidden={!active}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30"
        >
            <div className="bg-white/95 p-4 rounded-2xl shadow flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-stone-800 rounded-full animate-spin"></div>
                <span className="ml-2 text-stone-700 font-medium">Loading...</span>
            </div>
        </div>
    );
};


const ProductCard = ({ product, addToCart, onOpen, isBusy }) => {
    const key = `addToCart-${product._id}`;
    const busy = !!(isBusy && isBusy(key));
    const outOfStock = (product.quantity ?? 0) <= 0;
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div
                className="w-full h-40 sm:h-64 overflow-hidden cursor-pointer flex items-center"
                onClick={() => onOpen && onOpen(product._id)}
            >
               <img src={ product.image || `https://placehold.co/600x600/a855f7/ffffff?text=${encodeURIComponent(product.name || "Product")}` } alt={product.name} className="w-full h-full object-contain sm:object-cover object-center" />

            </div>
            <div className="p-4">
                <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                <h3 onClick={() => onOpen && onOpen(product._id)} className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mt-2 cursor-pointer">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm sm:text-lg md:text-xl font-normal sm:font-bold text-gray-800">₹{product.price.toFixed(2)}</span>

                    <button
                        onClick={() => addToCart(product)}
                        disabled={outOfStock || busy}
                        className={`bg-stone-800 text-amber-100 font-medium py-1 px-2 sm:py-2 sm:px-4 text-sm sm:text-base rounded-full hover:bg-stone-700 transition-colors duration-300 shadow-md w-1/3 sm:w-auto ${outOfStock || busy ? 'opacity-50 cursor-not-allowed hover:bg-stone-800' : ''}`}


                    >
                        {outOfStock ? 'Out of stock' : (busy ? 'Adding…' : 'Add to Cart')}
                    </button>

                </div>
            </div>
        </div>
    );
}


const SearchModal = ({ products, onClose, addToCart, onOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { document.body.style.overflow = 'hidden'; const onKey = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', onKey); return () => { document.body.style.overflow = 'auto'; window.removeEventListener('keydown', onKey); }; }, []);



    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto" onClick={onClose} onScroll={(e) => e.stopPropagation()}>

            <div className="bg-white rounded-xl w-full max-w-lg mx-4 sm:mx-auto p-6 shadow-lg relative" onClick={(e) => e.stopPropagation()}>


                <div className="p-4 border-b flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className="w-full p-3 border border-gray-300 rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-stone-800"
                    />

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    >
                        ✖
                    </button>

                </div>
                <div className="max-h-80 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div
                                key={product._id}
                                onClick={() => {
                                    onClose();
                                    onOpen(product._id);
                                }}
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                            >

                                <img
                                    src={product.image || `https://placehold.co/600x600/a855f7/ffffff?text=${encodeURIComponent(product.name)}`}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-md border"
                                />
                                <span className="text-gray-800">{product.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No products found.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

const HomePage = ({ products, isLoading, toastMessage, handleAddToCart, onOpen, isBusy, isSearchModalOpen, setIsSearchModalOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('none');

    const allCategories = ['Categories', ...new Set(products.map(product => product.category))];

    const filteredAndSortedProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortOrder === 'lowToHigh') {
                return a.price - b.price;
            }
            if (sortOrder === 'highToLow') {
                return b.price - a.price;
            }
            return 0;
        });

    return (
        <main id="Product-section" className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 ">

            <div className="text-center my-8 mt-0 ">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 ">Welcome to Artisan Crafts</h1>
                <p className="mt-2 text-base sm:text-lg text-gray-600">Explore our amazing handcrafted goods!</p>
            </div>

            <div className="flex flex-col md:flex-row  my-8 space-y-4 justify-between items-center md:space-y-0 md:space-x-4">
                <button
                    onClick={() => setIsSearchModalOpen(true)}
                    className="w-full sm:w-1/3 md:w-1/6 text-stone-800 border border-gray-300 rounded-full px-3 py-2 flex items-center justify-start gap-2 hover:bg-gray-100 text-sm"

                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className=" font-light sm:font-normal  sm:inline">Search</span>
                </button>

                <div className='flex gap-3'>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-40 md:w-36 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-800 text-sm"

                    >
                        {allCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full sm:w-40 md:w-36 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-800 text-sm"

                    >
                        <option value="none">Sort by Price</option>
                        <option value="lowToHigh">Price: Low to High</option>
                        <option value="highToLow">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <section className="my-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">All Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        <p className="text-center col-span-full text-gray-500">Loading products...</p>
                    ) : filteredAndSortedProducts.length > 0 ? (
                        filteredAndSortedProducts.map(product => <ProductCard key={product._id} product={product} addToCart={() => handleAddToCart(product)} onOpen={onOpen} isBusy={isBusy} />)
                    ) : (
                        <p className="text-center col-span-full text-gray-500">No products found.</p>
                    )}
                </div>
            </section>
            {toastMessage && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
                    {toastMessage}
                </div>
            )}
        </main>
    );
};

const CartPage = ({ cart, setCurrentPage, updateQuantity, removeItem, clearCart, goBack = () => window.history.back(), user, isBusy, anyBusy }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [candidate, setCandidate] = useState(null); // { _id, name, image }
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmClearOpen, setConfirmClearOpen] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const openClearConfirm = () => setConfirmClearOpen(true);
    const closeClearConfirm = () => setConfirmClearOpen(false);

    const handleClearConfirmYes = async () => {
        try {
            setIsClearing(true);
            await clearCart();
            setConfirmClearOpen(false);
        } catch (err) {
            console.error('Clear cart failed', err);
            // optionally show toast/error
        } finally {
            setIsClearing(false);
        }
    };



    // close on Escape
    useEffect(() => {
        if (!confirmOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setConfirmOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [confirmOpen]);

    const openConfirm = (item) => {
        setCandidate(item);
        setConfirmOpen(true);
    };

    const handleConfirmYes = async () => {
        if (!candidate) return;
        try {
            setIsDeleting(true);
            await removeItem(candidate._id); // await the parent's removeItem
            setConfirmOpen(false);
            setCandidate(null);
        } catch (err) {
            console.error('Delete failed', err);
            // optionally show a toast / error UI here
        } finally {
            setIsDeleting(false);
        }
    };

    const handleConfirmNo = () => {
        setConfirmOpen(false);
        setCandidate(null);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main className="flex-grow container mx-auto p-8">
            <button
                onClick={() => {
                    if (typeof setCurrentPage === "function") {
                        setCurrentPage("home");
                    } else {
                        goBack();
                    }
                }}
                className="mb-1 mt-0 text-sm text-stone-800/80 hover:text-amber-500 font-medium transition-colors flex gap-1">

                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19L5 12L12 5" />
                    <title>back</title>
                </svg> <span className='font-bold'>Back</span>
            </button>
            <h2 className="text-3xl font-bold text-center mb-8">Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-600">Your cart is empty.</p>
                    <button onClick={() => setCurrentPage('home')} className="mt-4 bg-stone-800 text-amber-100 font-medium py-2 px-6 rounded-full hover:bg-stone-700 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                       {cart.map(item => (
  <div key={item._id} className="flex flex-col sm:flex-row items-start bg-white p-4 rounded-xl shadow-sm">
    {/* IMAGE: large & centered on mobile, small left on desktop */}
    <div className="w-4/5 sm:w-24 h-48 sm:h-24 flex-shrink-0 mr-8 sm:mr-4 mx-auto sm:mx-0">
      <img
        src={
          item.image ||
          `https://placehold.co/600x600/a855f7/ffffff?text=${encodeURIComponent(item.name || "Product")}`
        }
        alt={item.name}
        className="w-full h-full object-cover rounded-md"
      />
    </div>

    {/* TITLE (always visible). On mobile center, on desktop left */}
    <div className="flex-1 w-full mt-3 sm:mt-0 text-center sm:text-left">
      <h3 className="font-semibold text-base sm:text-lg leading-snug">{item.name}</h3>
      {/* Desktop price: visible on sm+ and stays where desktop expects it */}
      <p className="text-gray-500 hidden sm:block mt-2">₹{item.price.toFixed(2)}</p>
    </div>

    {/* DESKTOP controls (qty + delete) — visible on sm+ */}
    <div className="hidden sm:flex items-center space-x-2 ml-3">
      <button
        onClick={() => { if (item.quantity > 1) updateQuantity(item._id, -1); }}
        disabled={Number(item.quantity) <= 1}
        title={Number(item.quantity) <= 1 ? "Minimum quantity reached. Use Remove to delete." : "Decrease quantity"}
        className={`w-8 h-8 rounded-full transition-all ${Number(item.quantity) <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        aria-label={Number(item.quantity) <= 1 ? "Minimum quantity" : "Decrease quantity"}
      >
        -
      </button>
      <span className="font-bold">{item.quantity}</span>
      <button
        onClick={() => updateQuantity(item._id, 1)}
        title="Increase quantity"
        className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        aria-label="Increase quantity"
      >
        +
      </button>

      <button
        onClick={() => openConfirm(item)}
        className="ml-4 text-red-500 hover:text-red-700"
        aria-label={`Remove ${item.name} from cart`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    {/* MOBILE single-row: price | qty controls | delete (visible only on mobile) */}
    <div className="flex sm:hidden w-full items-center justify-between mt-3">
      <div className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => { if (item.quantity > 1) updateQuantity(item._id, -1); }}
          disabled={Number(item.quantity) <= 1}
          title={Number(item.quantity) <= 1 ? "Minimum quantity reached. Use Remove to delete." : "Decrease quantity"}
          className={`w-8 h-8 rounded-full transition-all ${Number(item.quantity) <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          aria-label={Number(item.quantity) <= 1 ? "Minimum quantity" : "Decrease quantity"}
        >
          -
        </button>
        <span className="font-bold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item._id, 1)}
          title="Increase quantity"
          className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={() => openConfirm(item)}
        className="text-red-500 hover:text-red-700 p-1"
        aria-label={`Remove ${item.name} from cart`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
))}

                    </div>

                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
                        <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
                        <div className="space-y-2 text-gray-700">
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="mt-6 flex flex-col space-y-4">
                            <button
                                onClick={() => { user ? setCurrentPage('checkout') : setCurrentPage('login') }}
                                disabled={isBusy && isBusy('checkout')}
                                className={`w-full font-bold py-3 px-4 rounded-full transition-colors ${(isBusy && isBusy('checkout')) ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-stone-800 text-amber-100 hover:bg-stone-700'}`}
                            >
                                {(isBusy && isBusy('checkout')) ? 'Processing…' : 'Proceed to Checkout'}
                            </button>

                            <button
                                onClick={openClearConfirm}
                                disabled={cart.length === 0}
                                className={`w-full font-bold py-3 px-4 rounded-full transition-colors ${cart.length === 0 ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                            >
                                Clear Cart
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmOpen && candidate && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={handleConfirmNo} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
                        <div className="flex items-start gap-4">
                            <img src={candidate.image || `https://placehold.co/120x120/a855f7/ffffff?text=${encodeURIComponent(candidate.name)}`} alt={candidate.name} className="w-24 h-24 object-cover rounded-md" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold">{candidate.name}</h3>
                                <p className="text-sm text-gray-600 mt-2">Are you sure you want to remove this product from your cart?</p>
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={handleConfirmYes}
                                        disabled={isDeleting}
                                        className={`px-4 py-2 rounded-full font-semibold ${isDeleting ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                        aria-label="Confirm remove"
                                    >
                                        {isDeleting ? 'Removing...' : 'Yes, remove'}
                                    </button>
                                    <button
                                        onClick={handleConfirmNo}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-full border font-semibold"
                                        aria-label="Cancel remove"
                                    >
                                        No, keep it
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleConfirmNo} aria-label="Close" className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✖</button>
                    </div>
                </div>
            )}

            {/* Clear Cart Confirmation Modal */}
            {confirmClearOpen && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={closeClearConfirm} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-bold">Clear cart?</h3>
                            <p className="text-sm text-gray-600">
                                This will remove <strong>{cart.length} item{cart.length !== 1 ? 's' : ''}</strong> from your cart
                                {cart.length > 0 && <> (Total: ₹{cart.reduce((s, it) => s + it.price * it.quantity, 0).toFixed(2)})</>}.
                            </p>

                            {/* Optional small preview: show up to 3 item thumbnails */}
                            <div className="flex gap-3 flex-col">
                                {cart.slice(0, 3).map(it => (
                                    <div key={it._id || it.productId} className="flex gap-4 border border-green-200 rounded-lg p-2">
                                        <img
                                            src={it.image || `https://placehold.co/80x80/a855f7/ffffff?text=${encodeURIComponent(it.name)}`}
                                            alt={it.name}
                                            className="w-16 h-16 object-cover rounded-md border"
                                        />
                                        <span className="text-sm">
                                            {it.name} <br /> Total Qty : {it.quantity}
                                        </span>
                                    </div>
                                ))}

                                {cart.length > 3 && <div className="flex items-center justify-center w-16 h-16 rounded-md border text-sm text-gray-600">+{cart.length - 3}</div>}
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={handleClearConfirmYes}
                                    disabled={isClearing}
                                    className={`px-4 py-2 rounded-full font-semibold ${isClearing ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                >
                                    {isClearing ? 'Clearing...' : 'Yes, clear cart'}
                                </button>
                                <button
                                    onClick={closeClearConfirm}
                                    disabled={isClearing}
                                    className="px-4 py-2 rounded-full border font-semibold"
                                >
                                    No, keep items
                                </button>
                            </div>
                        </div>
                        <button onClick={closeClearConfirm} aria-label="Close" className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✖</button>
                    </div>
                </div>
            )}


        </main>
    );
};


const CheckoutPage = ({ cart, setCurrentPage, goBack = () => window.history.back(), handleCheckout, user, isBusy }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const handlePlaceOrder = async (event) => {
        event.preventDefault();
        setIsPlacingOrder(true);
        try {
            // optionally collect payment info from form and pass as payload
            await handleCheckout({}); // send empty payload or payment details
            setOrderPlaced(true);
            setIsPlacingOrder(false);
        } catch (err) {
            console.error('Place order failed', err);
            setIsPlacingOrder(false);
            // handleCheckout already shows toast & refreshes data on failure
        }
    };

    if (orderPlaced) {
        return (
            <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-700">Thank you for your purchase. You'll be redirected to the home page shortly.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            <button
                onClick={() => {
                    if (typeof setCurrentPage === "function") {
                        setCurrentPage("home");
                    } else {
                        goBack();
                    }
                }}
                className="mb-1 mt-16 sm:mt-0 relative z-20 text-sm text-stone-800/80 hover:text-amber-500 font-medium transition-colors flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19L5 12L12 5" />
                    <title>back</title>
                </svg> <span className='font-bold'>Back</span>
            </button>
            <h2 className="text-3xl font-bold text-center mb-8">Checkout</h2>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    {cart.map(item => (
                        <div key={item._id} className="flex justify-between items-center py-2 border-b">
                            <span>{item.name} x{item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center py-2 text-xl font-bold mt-4">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
                    <form className="space-y-4">
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" required placeholder="FullName" />
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" required placeholder="Address Line 1" />
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" required placeholder="City, State, ZIP" />
                    </form>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Payment Details</h3>
                    <form className="space-y-4">
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" disabled placeholder="Card Number" />
                        <div className="flex space-x-4">
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" disabled placeholder="MM/YY" />
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" disabled placeholder="CVV" />
                        </div>
                    </form>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || (isBusy && isBusy('checkout'))}
                    className="w-full bg-stone-800 text-amber-100 font-bold py-3 px-4 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50"
                >
                    {isPlacingOrder || (isBusy && isBusy('checkout')) ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </main>
    );
};

const LoginPage = ({ setCurrentPage, setAuthError, setUser, setAuthToken, apiFetch, isBusy }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthError("");

        try {
            const data = await apiFetch('/users/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            }, { requestKey: 'login' });

            if (!data.token) throw new Error('Server did not return a token');

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setUser(data.user);
            setAuthToken(data.token);
            setCurrentPage("home");
        } catch (error) {
            console.error("Login failed:", error);
            setAuthError(error.message);
        }

    };

    return (
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-stone-800 hover:bg-stone-700 text-amber-100 font-bold py-2 px-4 rounded-full"
                            type="submit"
                            disabled={isBusy && isBusy('login')}
                        >
                            {isBusy && isBusy('login') ? 'Signing in…' : 'Sign In'}
                        </button>
                        <button
                            onClick={() => setCurrentPage("register")}
                            type="button"
                            className="font-bold text-sm text-stone-800 hover:text-stone-600"
                        >
                            Create an account
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const RegisterPage = ({ setCurrentPage, setAuthError, setUser, apiFetch, setAuthToken, isBusy }) => {
    const [fullName, setFullName] = useState({ firstname: "", lastname: "" });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthError("");

        try {
            const data = await apiFetch('/users/register', {
                method: 'POST',
                body: JSON.stringify({
                    fullname: {
                        firstname: fullName.firstname,
                        lastname: fullName.lastname
                    }, email, password
                })
            }, { requestKey: 'register' });
            if (!data.token) { throw new Error('Server did not return a token'); }

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setUser(data.user);
            setAuthToken(data.token);
            setCurrentPage("home");
        } catch (error) {
            if (error.response && error.response.data) {
                // From backend JSON
                setAuthError(error.response.data.message);
                console.log("remove : error.response.data.message");
                console.error("Registration failed:", error.response.data.message);
            } else {
                // Fallback
                setAuthError(error.message);
                console.log("remove 444: error.message");
                console.error("Registration failed:", error.message);
            }
        }
    };

    return (
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">


            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="firstname"
                        >
                            First Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                            id="firstname"
                            type="text"
                            placeholder="First Name"
                            value={fullName.firstname}
                            onChange={(e) =>
                                setFullName({ ...fullName, firstname: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="lastname"
                        >
                            Last Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                            id="lastname"
                            type="text"
                            placeholder="Last Name"
                            value={fullName.lastname}
                            onChange={(e) =>
                                setFullName({ ...fullName, lastname: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-stone-800 hover:bg-stone-700 text-amber-100 font-bold py-2 px-4 rounded-full"
                            type="submit"
                            disabled={isBusy && isBusy('register')}
                        >
                            {isBusy && isBusy('register') ? 'Creating an Account...' : 'Register'}
                        </button>
                        <button
                            onClick={() => setCurrentPage("login")}
                            type="button"
                            className="font-bold text-sm text-stone-800 hover:text-stone-600"
                        >
                            Already have an account?
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};



const AdminDashboardPage = ({ products: propProducts, goBack = () => window.history.back(), setProducts: setPropProducts, setCurrentPage, apiFetch, isBusy, anyBusy }) => {

    const [localProducts, setLocalProducts] = useState(propProducts || []);
    const setGlobalProducts = typeof setPropProducts === 'function' ? setPropProducts : setLocalProducts;
    const [error, setError] = useState('');

    const [formState, setFormState] = useState({
        name: '',
        sku: '',
        brand: '',
        category: '',
        price: '',
        quantity: '',
        color: '',
        description: '',
        image: '',
    });

    const categories = [
        "Home & Living",
        "Kitchen & Dining",
        "Fashion & Accessories",
        "Gifts & Collectibles",
        "Wellness & Lifestyle",
        "Art & Craft",
        "Eco-friendly & Sustainable",
        "Other"
    ];

    const [editingProduct, setEditingProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);



    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await apiFetch('/products', { method: 'GET' }, { requestKey: 'admin.fetchProducts' });
            setLocalProducts(data);
            if (setPropProducts) setPropProducts(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Unable to fetch products');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFormChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleCreateUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');

        const payload = {
            name: formState.name.trim(),
            sku: formState.sku.trim() || `SKU-${Date.now()}`,
            brand: formState.brand.trim(),
            category: formState.category.trim(),
            price: parseFloat(formState.price) || 0,
            quantity: parseInt(formState.quantity || '0', 10),
            color: formState.color.trim(),
            description: formState.description.trim(),
            image: formState.image.trim(),
        };

        try {
            if (editingProduct) {
                await apiFetch(`/products/${editingProduct._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                }, { requestKey: `admin.update-${editingProduct._id}` });
                setMessage('Product updated successfully!');
            } else {
                await apiFetch('/products', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                }, { requestKey: 'admin.create' });
                setMessage('Product created successfully!');
            }

            await fetchProducts();
            setFormState({ name: '', sku: '', brand: '', category: '', price: '', quantity: '', color: '', description: '', image: '' });
            setEditingProduct(null);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        setIsSubmitting(true);
        setError('');
        setMessage('');
        try {
            await apiFetch(`/products/${productId}`, { method: 'DELETE' }, { requestKey: `admin.delete-${productId}` });
            setMessage('Product deleted successfully!');

            await fetchProducts();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Delete failed');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormState({
            name: product.name || '',
            sku: product.sku || '',
            brand: product.brand || '',
            category: product.category || '',
            price: product.price != null ? String(product.price) : '',
            quantity: product.quantity != null ? String(product.quantity) : '',
            color: product.color || '',
            description: product.description || '',
            image: product.image || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            <button
                onClick={() => {
                    if (typeof setCurrentPage === "function") {
                        setCurrentPage("home");
                    } else {
                        goBack();
                    }
                }}
                className="mb-1 mt-16 sm:mt-0 relative z-20 text-sm text-stone-800/80 hover:text-amber-500 font-medium transition-colors flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19L5 12L12 5" />
                    <title>back</title>
                </svg> <span className='font-bold'>Back</span>
            </button>
            <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>


            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8">
                <h3 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Create New Product'}</h3>


                <form onSubmit={handleCreateUpdate} className="space-y-4">
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formState.name}
                        onChange={handleFormChange}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="sku"
                            placeholder="SKU (optional)"
                            value={formState.sku}
                            onChange={handleFormChange}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formState.price}
                            onChange={handleFormChange}
                            step="0.01"
                            required
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formState.quantity}
                            onChange={handleFormChange}
                            required
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="brand"
                            placeholder="Brand"
                            value={formState.brand}
                            onChange={handleFormChange}
                            required
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                        />

                        <select
                            name="category"
                            value={formState.category}
                            onChange={handleFormChange}
                            className="border rounded px-3 py-2 w-full"
                            required
                        >
                            <option value="">-- Product category --</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>


                        <input
                            type="text"
                            name="color"
                            placeholder="Color (optional)"
                            value={formState.color}
                            onChange={handleFormChange}
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={formState.image}
                        onChange={handleFormChange}
                        required
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formState.description}
                        onChange={handleFormChange}
                        rows={4}
                        required
                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700"
                    />

                    {message && <p className={`text-sm text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-stone-800 text-amber-100 font-bold py-2 px-4 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50"
                            disabled={isSubmitting || (isBusy && isBusy('admin.create'))}
                        >
                            {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                        {editingProduct && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingProduct(null);
                                    setFormState({ name: '', sku: '', brand: '', category: '', price: '', quantity: '', color: '', description: '', image: '' });
                                }}
                                className="bg-gray-500 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-600 transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">

                <h3 className="text-2xl font-bold mb-4">All Products</h3>

                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {localProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">₹{Number(product.price || 0).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.quantity ?? '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => handleEditClick(product)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
};

function ProductDetail({ id, addToCart, handleAddToCart, toastMessage, goBack = () => window.history.back(), setCurrentPage, user, apiFetch, isBusy }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) {
            setError("No product id provided");
            setLoading(false);
            return;
        }
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError("");
            try {
                const data = await apiFetch(`/products/${id}`, { method: 'GET' }, { requestKey: `fetchProduct-${id}` });
                const p = data && (data._id ? data : data.product || data);
                if (!cancelled) setProduct(p);
            } catch (err) {
                console.error("Product fetch error", err);
                if (!cancelled) setError(err.message || "Failed to load product");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [id]);

    if (loading) return <div className="p-8">Loading product...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    if (!product) return <div className="p-8">No product found.</div>;

    const available = Number(product.quantity ?? 0);
    const inStock = available > 0;
    const addKey = `addToCart-${product._id}`;
    const adding = !!(isBusy && isBusy(addKey));

    return (
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            <button
                onClick={() => {
                    if (typeof setCurrentPage === "function") {
                        setCurrentPage("home");
                    } else {
                        goBack();
                    }
                }}
                className="mb-2 mt-1 sm:mt-2 relative z-20 text-sm text-stone-800/80 flex gap-2 hover:text-amber-500 font-medium transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19L5 12L12 5" />
                    <title>back</title>
                </svg> <span className='font-bold'>Back</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="lg:col-span-1">
                    <div className="w-full h-64 sm:h-96 overflow-hidden rounded-lg">
                        <img
                            src={
                                product.image ||
                                `https://placehold.co/600x600/a855f7/ffffff?text=${encodeURIComponent(
                                    product.name || "Product"
                                )}`
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <p className="text-sm text-gray-500">
                            {product.category} • {product.brand}
                        </p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">{product.name}</h1>
                        <p className="text-xl sm:text-2xl font-extrabold text-stone-800 mt-4">₹{Number(product.price || 0).toFixed(2)}</p>
                        <p className={`mt-2 font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
                            {inStock ? `In stock — ${available} available` : "Out of stock"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                        <button
                            className="bg-stone-800 text-amber-100 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base"
                            disabled={!inStock || adding}
                            onClick={() => handleAddToCart(product)}
                        >
                            {adding ? 'Adding…' : 'Add to Cart'}
                        </button>

                        <button
                            onClick={() => {
                                // no-op if disabled; this won't run because button will be disabled
                                addToCart(product);
                                if (typeof setCurrentPage === "function") { user ? setCurrentPage("checkout") : setCurrentPage('login') }
                            }}
                            disabled={!inStock}
                            aria-disabled={!inStock}
                            title={!inStock ? 'Available soon' : 'Buy now'}
                            className={`py-3 px-5 border rounded-full transition-colors focus:outline-none ${!inStock
                                ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-500'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            {!inStock ? 'Available soon' : 'Buy Now'}
                        </button>
                    </div>

                </div>
            </div>
            {toastMessage && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
                    {toastMessage}
                </div>
            )}
        </main>
    );
}

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [authToken, setAuthToken] = useState(null);
    const [authError, setAuthError] = useState('');
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [toastMessage, setToastMessage] = useState("");

    const [inFlight, setInFlight] = useState({});
    const inFlightPromisesRef = useRef({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') { setMobileMenuOpen(false); setIsSearchModalOpen(false); } };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // helpers
    const setInFlightFor = (key, val) => setInFlight(prev => ({ ...prev, [key]: val }));
    const isBusy = (key) => !!inFlight[key];
    const anyBusy = Object.values(inFlight).some(Boolean) || isLoading;


    const apiFetch = async (path, options = {}, opts = {}) => {
        // opts: { requestKey }
        const { requestKey } = opts || {};

        // if a request is already running with the same key, return the same promise
        if (requestKey && inFlightPromisesRef.current[requestKey]) {
            return inFlightPromisesRef.current[requestKey];
        }

        // create the request promise and store it in the ref so duplicates can reuse it
        const requestPromise = (async () => {
            if (requestKey) setInFlightFor(requestKey, true);

            try {
                // build headers (respect explicit headers)
                const headers = { ...(options.headers || {}) };
                // case-insensitive Content-Type check
                const hasContentType = Object.keys(headers).some(k => k.toLowerCase() === 'content-type');
                if (!hasContentType && (options.method || 'GET').toUpperCase() !== 'GET') {
                    headers['Content-Type'] = 'application/json';
                }

                const token = localStorage.getItem('authToken') || authToken;
                if (token) headers.Authorization = `Bearer ${token}`;

                const res = await fetch(`${API_BASE}${path}`, { credentials: options.credentials ?? 'include', ...options, headers });

                if (res.status === 401) {
                    // session expired — friendly handling
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    setUser(null);
                    setAuthToken(null);
                    setToastMessage('Session expired — please log in again.');
                    setTimeout(() => setToastMessage(''), 3000);
                    throw new Error('Invalid email or password');
                }

                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    const message = text || `Request failed: ${res.status}`;
                    throw new Error(message);
                }

                const ct = (res.headers.get('content-type') || '').toLowerCase();
                if (ct.includes('application/json')) return await res.json();
                return await res.text();
            } catch (err) {
                // network vs other errors
                if (err instanceof TypeError || err.message === 'Failed to fetch') {
                    throw new Error('Network error — check your internet connection.');
                }
                throw err;
            } finally {
                if (requestKey) setInFlightFor(requestKey, false);
                // clear stored promise from ref
                if (requestKey) delete inFlightPromisesRef.current[requestKey];
            }
        })();

        if (requestKey) {
            inFlightPromisesRef.current[requestKey] = requestPromise;
        }

        return requestPromise;
    };




    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (!storedToken || !storedUser) {
            setUser(null);
            setAuthToken(null);
            return;
        }
        setUser(JSON.parse(storedUser));
        setAuthToken(storedToken);

        (async () => {
            try {
                const data = await apiFetch('/users/profile', { method: 'GET' }, { requestKey: 'validateToken' });
                const serverUser = data.user || data;
                setUser(serverUser);
                localStorage.setItem('user', JSON.stringify(serverUser));
            } catch (err) {
                // apiFetch already cleared localStorage on 401 and set toast
                console.error('Token validation failed:', err);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setUser(null);
                setAuthToken(null);
                return;
            }

        })();
    }, []);

    useEffect(() => {
        if (currentPage === 'admin-dashboard' && (!user || !user.isAdmin)) {
            setToastMessage('Access denied — admin only');
            setTimeout(() => setToastMessage(''), 2500);
            setCurrentPage('home');
        }
    }, [currentPage, user]);


    // helper to fetch & normalize products (call this from elsewhere too)
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await apiFetch('/products', { method: 'GET' }, { requestKey: 'fetchProducts' });
            const normalized = (data || []).map(p => ({
                ...p,
                price: Number(p.price || 0),
                quantity: Number(p.quantity || 0)
            }));
            setProducts(normalized);
            return normalized;
        } catch (err) {
            console.error('fetchProducts error', err);
            setToastMessage(err.message || 'Could not load products');
            setTimeout(() => setToastMessage(''), 3000);
            return [];
        } finally {
            setIsLoading(false);
        }
    };


    // initially load products
    useEffect(() => {
        fetchProducts();
    }, []);


    useEffect(() => {
        (async () => {
            if (user) {
                await mergeLocalCartOnLogin();
            } else {
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    try {
                        setCart(JSON.parse(storedCart));
                    } catch {
                        setCart([]);
                    }
                } else {
                    setCart([]);
                }
            }
        })();
    }, [user]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            localStorage.removeItem('cart');
        }
    }, [cart, user]);


    const handleLogout = async () => {
        try {
            await apiFetch('/users/logout', { method: 'POST' }, { requestKey: 'logout' });
        } catch (err) {
            console.warn('Logout request failed:', err);
        }
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
        setAuthToken(null);
        setCart([]);
        window.location.replace(`${import.meta.env.FRONTEND_URL}`);
    };

    // ---- helpers for inventory checks ----
    const getProductById = (id) => products.find(p => String(p._id) === String(id));

    const cartQtyFor = (productId) => {
        const it = cart.find(i => String(i._id) === String(productId));
        return it ? Number(it.quantity || 0) : 0;
    };

    const canAddToCart = (productId, qtyToAdd = 1) => {
        const prod = getProductById(productId);
        if (!prod) return false;
        const available = Number(prod.quantity ?? 0);
        const alreadyInCart = cartQtyFor(productId);
        return (alreadyInCart + Number(qtyToAdd)) <= available;
    };


    const addToCart = async (product) => {
        setAuthError('');

        // local check first
        if (!canAddToCart(product._id, 1)) {
            const avail = getProductById(product._id)?.quantity ?? 0;
            setToastMessage(`Only ${avail} left in stock`);
            setTimeout(() => setToastMessage(""), 3000);
            return;
        }

        if (!user) {
            setCart((prev) => {
                const idx = prev.findIndex(item => item._id === product._id);
                if (idx !== -1) {
                    const currQty = Number(prev[idx].quantity || 0);
                    if (currQty + 1 > (getProductById(product._id)?.quantity ?? Infinity)) {
                        setToastMessage(`Cannot add more than available stock`);
                        setTimeout(() => setToastMessage(""), 2000);
                        return prev;
                    }
                    return prev.map((it, i) =>
                        i === idx ? { ...it, quantity: currQty + 1 } : it
                    );
                }
                return [...prev, { ...product, quantity: 1, price: Number(product.price || 0) }];
            });
            setToastMessage(`${product.name} added to cart`);
            setTimeout(() => setToastMessage(""), 2500);
            return;
        }

        const key = `addToCart-${product._id}`;
        try {
            await apiFetch('/cart/add', {
                method: 'POST',
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            }, { requestKey: key });

            await fetchServerCart();
            setToastMessage(`${product.name} added to cart`);
            setTimeout(() => setToastMessage(""), 2500);
        } catch (err) {
            console.error('addToCart error', err);
            setAuthError(err.message || 'Could not add to cart');
            setToastMessage(err.message || 'Could not add to cart');
            setTimeout(() => setToastMessage(""), 3000);
            throw err;
        }
    };



    const handleAddToCart = async (product) => {
        try {
            await addToCart(product); // addToCart will set toast on success
        } catch (err) {
            console.error('handleAddToCart error:', err);
        }
    };


    const fetchServerCart = async () => {
        try {
            const data = await apiFetch('/cart', { method: 'GET' }, { requestKey: 'fetchServerCart' });
            const serverCart = Array.isArray(data) ? data : data.cart || data;
            const mapped = serverCart.map(ci => {
                const prod = ci.product || ci.productId || ci.productId?.product || {};
                const id = prod._id || prod.id || ci.productId || ci._id || ci.id;
                const rawQty = ci.quantity ?? ci.qty ?? 1;
                return {
                    _id: id,
                    name: prod.name || ci.name || 'Unknown',
                    price: Number(prod.price ?? ci.price ?? 0),
                    quantity: Number(rawQty || 0),
                    image: prod.image || (ci.product && ci.product.image) || '',
                    serverCartItemId: ci._id || ci.id || undefined,
                    raw: ci,
                };
            });
            setCart(mapped);
            return mapped;
        } catch (err) {
            console.error('fetchServerCart error', err);
            setToastMessage(err.message || 'Could not fetch cart');
            setTimeout(() => setToastMessage(''), 3000);
            return [];
        }
    };


    const mergeLocalCartOnLogin = async () => {
        try {
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (!Array.isArray(localCart) || localCart.length === 0) {
                await fetchServerCart();
                return;
            }
            for (const item of localCart) {
                try {
                    await apiFetch('/cart/add', {
                        method: 'POST',
                        body: JSON.stringify({ productId: item._id, quantity: item.quantity || 1 })
                    }, { requestKey: `mergeCart-${item._id}` });
                } catch (err) {
                    console.error('merge item failed', item, err);
                }
            }
            const merged = await fetchServerCart();
            localStorage.removeItem('cart');
            return merged;
        } catch (err) {
            console.error('mergeLocalCartOnLogin error', err);
        }
    };

    const updateQuantity = async (productId, change) => {
        if (Number(change) === 0) return;

        const curr = cart.find(i => String(i._id) === String(productId));
        const prevQty = Number(curr?.quantity || 0);
        const newQty = prevQty + Number(change);

        if (newQty <= 0) {
            if (user) {
                await handleServerRemove(productId);
            } else {
                setCart(prev => prev.filter(i => String(i._id) !== String(productId)));
            }
            return;
        }

        // local stock guard
        const product = getProductById(productId);
        if (product && newQty > Number(product.quantity || 0)) {
            setToastMessage(`Only ${product.quantity} items available`);
            setTimeout(() => setToastMessage(""), 2500);
            return;
        }

        if (!user) {
            // guest cart update
            setCart(prev =>
                prev.map(item =>
                    String(item._id) === String(productId) ? { ...item, quantity: newQty } : item
                )
            );
            return;
        }

        // optimistic update for logged-in user
        setCart(prev => prev.map(item => String(item._id) === String(productId) ? { ...item, quantity: newQty } : item));

        try {
            await apiFetch('/cart/add', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity: Number(change) }),
            }, { requestKey: `updateQty-${productId}` });

            await fetchServerCart();

        } catch (err) {
            console.error('updateQuantity error', err);
            // rollback
            setCart(prev =>
                prev.map(item => String(item._id) === String(productId) ? { ...item, quantity: prevQty } : item)
                    .filter(item => Number(item.quantity) > 0)
            );
            setToastMessage('Could not update quantity. Try again.');
            setTimeout(() => setToastMessage(""), 2500);
        }
    };



    const handleServerRemove = async (productId) => {
        try {
            await apiFetch(`/cart/remove/${productId}`, { method: 'DELETE' }, { requestKey: `removeItem-${productId}` });
            await fetchServerCart();
        } catch (err) {
            console.error('handleServerRemove error', err);
        }
    };

    const removeItem = async (productId) => {
        if (!user) {
            setCart(prev => prev.filter(item => item._id !== productId));
            return;
        }
        await handleServerRemove(productId);
    };


    const clearCart = async () => {
        if (!user) {
            setCart([]);
            try { localStorage.removeItem('cart'); } catch (_) { }
            return;
        }
        try {
            await apiFetch('/cart/clear', { method: 'DELETE' }, { requestKey: 'clearCart' });
            setCart([]);
            return;
        } catch (e) {
            console.warn('cart/clear failed', e);
            // fallback per-item removal (keep existing fallback code but replace fetch with apiFetch)
        }

        // fallback - remove items one by one
        try {
            const serverCart = await fetchServerCart();
            for (const it of serverCart) {
                try {
                    const idToRemove = it.productId?._id || it.productId;
                    if (idToRemove) {
                        await apiFetch(`/cart/remove/${idToRemove}`, { method: 'DELETE' }, { requestKey: `clearItem-${idToRemove}` });
                    }
                } catch (e) { console.warn('Remove fallback failed', e); }
            }
            await fetchServerCart();
            setCart([]);
        } catch (err) {
            console.error('clearCart fallback failed', err);
        }
    };


    // --- handleCheckout: perform server checkout and refresh products/cart ---
    const handleCheckout = async (paymentPayload = {}) => {
        if (!cart || cart.length === 0) {
            setToastMessage('Cart is empty');
            setTimeout(() => setToastMessage(''), 2000);
            return;
        }

        const orderItems = cart.map(ci => ({ productId: ci._id, quantity: Number(ci.quantity || 0) }));

        try {
            const resp = await apiFetch('/checkout', {
                method: 'POST',
                body: JSON.stringify({ items: orderItems, payment: paymentPayload })
            }, { requestKey: 'checkout' });

            // --- attempt to clear server-side cart (preferred) ---
            try {
                await apiFetch('/cart/clear', { method: 'DELETE' }, { requestKey: 'clearCart' });
                await fetchServerCart();
            } catch (e) {
                // fallback remove using apiFetch per-item
                const serverCart = await fetchServerCart();
                for (const it of serverCart) {
                    try {
                        const idToRemove = it.serverCartItemId || it._id || it.productId;
                        if (idToRemove) {
                            await apiFetch(`/cart/remove/${idToRemove}`, { method: 'DELETE' }, { requestKey: `clearItem-${idToRemove}` });
                        }
                    } catch (ee) {
                        console.warn('Fallback remove failed for', it, ee);
                    }
                }
            }

            // --- clear client-side cart (both for logged-in and guest) ---
            setCart([]);
            try { localStorage.removeItem('cart'); } catch (e) { /* ignore */ }

            // refresh product list to reflect new inventory
            await fetchProducts();

            setToastMessage('Order placed successfully!');
            setTimeout(() => setToastMessage(''), 3500);

            setCurrentPage('home'); // or an orders/confirmation page
            return resp;
        } catch (err) {
            console.error('handleCheckout error', err);
            setToastMessage(err.message || 'Checkout failed. Please try again.');
            setTimeout(() => setToastMessage(''), 3500);

            await fetchServerCart().catch(() => { });
            await fetchProducts().catch(() => { });
            throw err;
        }
    };




    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage products={products} toastMessage={toastMessage} handleAddToCart={handleAddToCart} isLoading={isLoading} setCurrentPage={setCurrentPage} addToCart={addToCart} onOpen={(id) => { setCurrentProductId(id); setCurrentPage('product'); }} isSearchModalOpen={isSearchModalOpen} setIsSearchModalOpen={setIsSearchModalOpen} isBusy={isBusy}
                    anyBusy={anyBusy} />;
            case 'product':
                return <ProductDetail id={currentProductId} addToCart={addToCart} setCurrentPage={setCurrentPage} toastMessage={toastMessage} handleAddToCart={handleAddToCart} user={user}
                    apiFetch={apiFetch}
                    isBusy={isBusy} />;
            case 'login':
                return <LoginPage setCurrentPage={setCurrentPage} setAuthError={setAuthError} setUser={setUser} setAuthToken={setAuthToken} apiFetch={apiFetch} isBusy={isBusy} />;
            case 'register':
                return <RegisterPage setCurrentPage={setCurrentPage} setAuthError={setAuthError} setUser={setUser} setAuthToken={setAuthToken} apiFetch={apiFetch} isBusy={isBusy} />;
            case 'profile':
                return <ProfilePage user={user} authToken={authToken} setAuthError={setAuthError} setCurrentPage={setCurrentPage} handleLogout={handleLogout} cart={cart} />;
            case 'admin-dashboard':
                return <AdminDashboardPage products={products} setProducts={setProducts} authToken={authToken} setAuthError={setAuthError} setCurrentPage={setCurrentPage} apiFetch={apiFetch} isBusy={isBusy} anyBusy={anyBusy} />;
            case 'cart':
                return <CartPage cart={cart} setCurrentPage={setCurrentPage} updateQuantity={updateQuantity} removeItem={removeItem} clearCart={clearCart} user={user} isBusy={isBusy} anyBusy={anyBusy} />;
            case 'checkout':
                return <CheckoutPage cart={cart} setCurrentPage={setCurrentPage} handleCheckout={handleCheckout} user={user} isBusy={isBusy} />;
            default:
                return <HomePage products={products} isLoading={isLoading} setCurrentPage={setCurrentPage} addToCart={addToCart} isBusy={isBusy} anyBusy={anyBusy} />;
        }
    };

    return (
        <div className=" hide-scrollbar min-h-screen flex flex-col font-sans">
            <Toast message={toastMessage} />
            <GlobalLoading active={anyBusy} />
            <header className="bg-stone-800 shadow-md  fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center py-4">
                    <a href="#" onClick={() => setCurrentPage('home')} className="text-amber-100 text-xl sm:text-2xl font-serif font-bold tracking-widest">ARTISAN</a>
                    <nav className='flex items-center space-x-6'>
                        {/* <button onClick={() => setIsSearchModalOpen(true)} className='text-amber-100 border border-1 rounded-full px-4 py-1 flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search</span>
                        </button> */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button onClick={() => setCurrentPage('cart')} className="text-amber-100 p-2 rounded focus:outline-none relative" aria-label="Open cart">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.198 1.704.707 1.704H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                {cart.length > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-stone-800 transform translate-x-1/2 -translate-y-1/2 bg-amber-100 rounded-full">{cart.length}</span>}
                            </button>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} className="text-amber-100 p-2 rounded focus:outline-none" aria-label="Toggle menu">{mobileMenuOpen ? '✖' : '☰'}</button>
                        </div>
                        <ul className="hidden md:flex space-x-6 text-amber-100 items-center">
                            <li><button onClick={() => {
                                setCurrentPage('home');
                                setTimeout(() => {
                                    document.getElementById("Product-section")?.scrollIntoView({
                                        behavior: "smooth"
                                    });
                                }, 50);
                            }} className="hover:text-amber-300 font-medium transition-colors">Shop</button></li>
                            {user ? (
                                <>
                                    {user.isAdmin && <li><button onClick={() => setCurrentPage('admin-dashboard')} className="hover:text-amber-300 font-medium transition-colors">Admin</button></li>}

                                    <li><button onClick={() => setCurrentPage('profile')} className=" flex items-center justify-center w-7 h-7 rounded-full ">

                                        <svg fill="#FFECB3" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                            width="100px" height="100px" viewBox="0 0 45.532 45.532"
                                            xmlSpace="preserve">
                                            <g>
                                                <path d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765
		                                                S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53
		                                                c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012
		                                                c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592
		                                                c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"/>
                                            </g>
                                        </svg>

                                    </button></li>
                                </>
                            ) : (
                                <li><button onClick={() => setCurrentPage('login')} className="hover:text-amber-300 font-medium transition-colors">Login</button></li>
                            )}

                            <li>
                                <button onClick={() => setCurrentPage('cart')} className="relative top-1 hover:text-amber-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.198 1.704.707 1.704H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cart.length > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-stone-800 transform translate-x-1/2 -translate-y-1/2 bg-amber-100 rounded-full">{cart.length}</span>
                                    )}
                                </button>
                            </li>
                        </ul>
                    </nav>
                   {mobileMenuOpen && (
  <>
    <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)} />
    <div className="md:hidden absolute top-full right-4 mt-2 bg-stone-800 rounded-lg shadow-lg z-50 w-56" role="dialog" aria-modal="true">
      <ul className="flex flex-col p-3 space-y-2 text-amber-100">
        <li>
          <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); document.getElementById('Product-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left w-full">Shop</button>
        </li>
        {user ? (
          <>
            {user.isAdmin && <li><button onClick={() => { setCurrentPage('admin-dashboard'); setMobileMenuOpen(false); }} className="text-left w-full">Admin</button></li>}
            <li><button onClick={() => { setCurrentPage('profile'); setMobileMenuOpen(false); }} className="text-left w-full">Profile</button></li>
          </>
        ) : (
          <li><button onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }} className="text-left w-full">Login</button></li>
        )}
        <li><button onClick={() => { setCurrentPage('cart'); setMobileMenuOpen(false); }} className="text-left w-full">Cart ({cart.length})</button></li>
      </ul>
    </div>
  </>
)}


                </div>
            </header>
            <div className='pt-20 sm:pt-16 flex-1'>
                {currentPage === 'home' && (
                    <div className="relative w-full h-92 sm:h-[400px] md:h-[500px] lg:h-[688px] overflow-hidden">
                        <img src="https://media.craftmaestros.com/media/magefan_blog/Elevate_Your_Home_Decor_With_Craft_Maestros.jpg" alt="Hero" className="absolute top-[-190px] w-full h-[calc(100% + 400px)] object-cover" />
                        <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                            <div className="text-center text-white px-4 max-w-3xl">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-4 leading-tight tracking-wide">Handcrafted Goods for a Thoughtful Home</h1>
                                <p className="text-sm sm:text-base md:text-lg font-light mb-8 max-w-xl mx-auto">Discover our curated collection of unique items made with intention by skilled artisans.</p>
                                <button onClick={() => {
                                    setCurrentPage('home');
                                    setTimeout(() => {
                                        document.getElementById("Product-section")?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                    }, 50);
                                }} className="w-full sm:w-auto bg-amber-100 text-stone-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition-colors shadow-lg">Explore the Collection</button>

                            </div>
                        </div>
                    </div>
                )}

                {authError && (
                    <div className="container mx-auto px-4 mt-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{authError}</span>
                        </div>
                    </div>
                )}
                {renderPage()}
                {isSearchModalOpen && <SearchModal products={products} onClose={() => setIsSearchModalOpen(false)} addToCart={addToCart} onOpen={(id) => { setCurrentProductId(id); setCurrentPage('product'); }} />}
            </div>
            <footer className="bg-stone-900 text-amber-100 py-6 mt-auto text-xs  px-6 sm:text-base ">
                <div className='flex flex-col items-center'>
                    <h3 className="text-xl font-bold font-serif text-white ">ARTISAN</h3>
                    <p className='text-white'>At ARTISAN, we believe every product has a story. They're all made by hand, with heart, to support the talented artists who create them.</p>
                </div>

                <div className="text-center mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs sm:text-sm">&copy; 2025 ARTISAN. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
