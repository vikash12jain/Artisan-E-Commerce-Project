import { useState, useEffect } from 'react';

import ProfilePage from '../Pages/Profile'

const API_BASE = import.meta.env.VITE_API_URL;


const ProductCard = ({ product, addToCart, onOpen }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div
                className="w-full h-64 overflow-hidden cursor-pointer"
                onClick={() => onOpen && onOpen(product._id)}
            >
                <img src={
                    product.image ||
                    `https://placehold.co/600x600/a855f7/ffffff?text=${encodeURIComponent(
                        product.name || "Product"
                    )}`
                } alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
                <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                <h3 onClick={() => onOpen && onOpen(product._id)} className="text-lg font-semibold text-gray-800 mt-2 cursor-pointer">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-gray-800">₹{product.price.toFixed(2)}</span>
                    <button onClick={() => addToCart(product)} className="bg-stone-800 text-amber-100 font-medium py-2 px-4 rounded-full hover:bg-stone-700 transition-colors duration-300 shadow-md">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}


const SearchModal = ({ products, onClose, addToCart, onOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);


    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto" onScroll={(e) => e.stopPropagation()}>

            <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">

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

const HomePage = ({ products, isLoading, setCurrentPage, addToCart, onOpen, isSearchModalOpen, setIsSearchModalOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('none');

    const allCategories = ['All', ...new Set(products.map(product => product.category))];

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
        <main id="Product-section" className="flex-grow container mx-auto p-8"> 
            <div className="text-center my-8">
                <h1 className="text-4xl font-bold text-gray-800">Welcome to Artisan Crafts</h1>
                <p className="mt-2 text-lg text-gray-600">Explore our amazing handcrafted goods!</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between my-8 space-y-4 md:space-y-0 md:space-x-4">
                <button
                    onClick={() => setIsSearchModalOpen(true)}
                    className="w-full md:w-1/3 text-stone-800 border border-gray-300 rounded-full px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search</span>
                </button>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-800"
                >
                    {allCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-800"
                >
                    <option value="none">Sort by Price</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                </select>
            </div>

            <section className="my-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">All Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        <p className="text-center col-span-full text-gray-500">Loading products...</p>
                    ) : filteredAndSortedProducts.length > 0 ? (
                        filteredAndSortedProducts.map(product => <ProductCard key={product._id} product={product} addToCart={addToCart} onOpen={onOpen} />)
                    ) : (
                        <p className="text-center col-span-full text-gray-500">No products found.</p>
                    )}
                </div>
            </section>



        </main>
    );
};

const CartPage = ({ cart, setCurrentPage, updateQuantity, removeItem, clearCart, goBack = () => window.history.back() }) => {
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
                className="mb-1 mt-0  text-sm text-stone-800/80 hover:underline flex gap-1">
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
                            <div key={item._id} className="flex items-center bg-white p-4 rounded-xl shadow-sm">
                                <div className="w-24 h-24 flex-shrink-0 mr-4">
                                    <img src={
                                        item.image ||
                                        `https://placehold.co/600x600/a855f7/ffffff?text=${encodeURIComponent(
                                            item.name || "Product"
                                        )}`
                                    } alt={item.name} className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-500">₹{item.price.toFixed(2)}</p>
                                </div>
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

                                {/* DELETE button now opens confirm modal */}
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
                                onClick={() => setCurrentPage('checkout')}
                                className="w-full bg-stone-800 text-amber-100 font-bold py-3 px-4 rounded-full hover:bg-stone-700 transition-colors"
                            >
                                Proceed to Checkout
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
                                {cart.slice(0, 3).map(it => {
                                    return (
                                        <div className='flex gap-4  border border-green-200 rounded-lg p-2 '>
                                            <img key={it._id} src={it.image || `https://placehold.co/80x80/a855f7/ffffff?text=${encodeURIComponent(it.name)}`} alt={it.name} className="w-16 h-16 object-cover rounded-md border" />
                                            <span className='text-sm '>{it.name} <br /> Total Qty : {it.quantity} </span>
                                        </div>
                                    )
                                })}
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


const CheckoutPage = ({ cart, setCurrentPage, clearCart }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handlePlaceOrder = async (event) => {
        event.preventDefault();
        setIsPlacingOrder(true);

        setTimeout(async () => {
            await clearCart();
            setIsPlacingOrder(false);
            setOrderPlaced(true);
            setTimeout(() => {
                setCurrentPage('home');
            }, 3000);
        }, 1500);
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
        <main className="flex-grow container mx-auto p-8">
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
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" placeholder="Full Name" />
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" placeholder="Address Line 1" />
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" placeholder="City, State, ZIP" />
                    </form>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Payment Details</h3>
                    <form className="space-y-4">
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" placeholder="Card Number" />
                        <div className="flex space-x-4">
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" placeholder="MM/YY" />
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" type="text" placeholder="CVV" />
                        </div>
                    </form>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-stone-800 text-amber-100 font-bold py-3 px-4 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50"
                >
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </main>
    );
};

const LoginPage = ({ setCurrentPage, setAuthError, setUser, setAuthToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthError("");

        try {
            const response = await fetch(`${API_BASE}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();
            console.log('LOGIN response:', response.status, data);

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }
            if (!data.token) {
                throw new Error('Server did not return a token');
            }
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
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
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
                        >
                            Sign In
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

const RegisterPage = ({ setCurrentPage, setAuthError, setUser, setAuthToken }) => {
    const [fullName, setFullName] = useState({ firstname: "", lastname: "" });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthError("");

        try {
            const response = await fetch(`${API_BASE}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullname: {
                        firstname: fullName.firstname,
                        lastname: fullName.lastname
                    },
                    email,
                    password,
                }),
            });

            const data = await response.json();
            console.log("Backend response:", data);

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }
            if (!data.token) throw new Error('Server did not return a token');
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setAuthToken(data.token);
            setCurrentPage("home");
        } catch (error) {
            console.error("Registration failed:", error);
            setAuthError(error.message);
        }
    };

    return (
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
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
                        >
                            Register
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



<ProfilePage />


const AdminDashboardPage = ({ products: propProducts, goBack = () => window.history.back(), setProducts: setPropProducts, setCurrentPage }) => {

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
            const res = await fetch(`${API_BASE}/products`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
            const data = await res.json();
            setLocalProducts(data);
            if (setPropProducts) setPropProducts(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Unable to fetch products');
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
            let res;
            if (editingProduct) {
                res = await fetch(`${API_BASE}/products/${editingProduct._id}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Update failed: ${res.status} ${errText}`);
                }
                await res.json();
                setMessage('Product updated successfully!');
            } else {

                res = await fetch(`${API_BASE}/products`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Create failed: ${res.status} ${errText}`);
                }
                await res.json();
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
            const res = await fetch(`${API_BASE}/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Delete failed: ${res.status} ${errText}`);
            }
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
        <main className="flex-grow container mx-auto p-8">
            <button
                onClick={() => {
                    if (typeof setCurrentPage === "function") {
                        setCurrentPage("home");
                    } else {
                        goBack();
                    }
                }}
                className="mb-1 mt-0  text-sm text-stone-800/80 hover:underline flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19L5 12L12 5" />
                    <title>back</title>
                </svg> <span className='font-bold'>Back</span>
            </button>
            <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h2>


            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
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

                        {formState.category === "Other" && (
                            <input
                                type="text"
                                name="customCategory"
                                placeholder="Enter custom category"
                                value={customCategory}
                                onChange={(e) => {
                                    setCustomCategory(e.target.value);
                                    handleFormChange({
                                        target: { name: "category", value: e.target.value }
                                    });
                                }}
                                className="border rounded px-3 py-2 w-full mt-2"
                            />
                        )}
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
                            disabled={isSubmitting}
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

            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4">All Products</h3>

                <div className="bg-white p-8 rounded-xl shadow-lg">
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
            </div>
        </main>
    );
};

function ProductDetail({ id, addToCart, goBack = () => window.history.back(), setCurrentPage }) {
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
                const res = await fetch(`${API_BASE}/products/${id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`Failed to load product (${res.status}) ${txt}`);
                }
                const data = await res.json();
                const p = data && (data._id ? data : data.product || data);
                if (!cancelled) setProduct(p);
            } catch (err) {
                console.error("Product fetch error", err);
                if (!cancelled) setError(err.message || "Failed to load product");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) return <div className="p-8">Loading product...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    if (!product) return <div className="p-8">No product found.</div>;

    const available = (product.quantity ?? 0) - (product.sold ?? 0);
    const inStock = available > 0;

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
                className="mb-6 text-sm text-stone-800/80 hover:underline flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19L5 12L12 5" />
                    <title>back</title>
                </svg> <span className='font-bold'>Back</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="lg:col-span-1">
                    <div className="w-full h-96 overflow-hidden rounded-lg">
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
                        <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
                        <p className="text-2xl font-extrabold text-stone-800 mt-4">₹{Number(product.price || 0).toFixed(2)}</p>
                        <p className={`mt-2 font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
                            {inStock ? `In stock — ${available} available` : "Out of stock"}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <button
                            className="bg-stone-800 text-amber-100 font-bold py-3 px-6 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50"
                            disabled={!inStock}
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={() => {
                                addToCart(product);
                                if (typeof setCurrentPage === "function") setCurrentPage("checkout");
                            }}
                            className="py-3 px-5 border rounded-full"
                        >
                            Buy Now
                        </button>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <p>
                            <strong>SKU:</strong> {product.sku || "-"}
                        </p>
                        <p>
                            <strong>Sold:</strong> {product.sold ?? 0}
                        </p>
                        <p>
                            <strong>Category:</strong> {product.category || "-"}
                        </p>
                    </div>
                </div>
            </div>
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
                const res = await fetch(`${API_BASE}/users/profile`, {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });

                if (!res.ok) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    setUser(null);
                    setAuthToken(null);
                    return;
                }
                const data = await res.json();
                const serverUser = data.user || data;
                setUser(serverUser);
                localStorage.setItem('user', JSON.stringify(serverUser));
            } catch (err) {
                console.error('Token validation failed:', err);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setUser(null);
                setAuthToken(null);
            }
        })();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_BASE}/products`)
            .then(r => r.json())
            .then(data => {
                const normalized = (data || []).map(p => ({ ...p, price: Number(p.price || 0) }));
                setProducts(normalized);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
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
            const token = localStorage.getItem("authToken");
            await fetch(`${API_BASE}/users/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout request failed:", err);
        }
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
        setAuthToken(null);
        setCart([]);
        setCurrentPage("home");
    };
    const addToCart = async (product) => {
        setAuthError('');

        if (!user) {
            setCart((prev) => {
                const idx = prev.findIndex(item => item._id === product._id);
                if (idx !== -1) {
                    return prev.map((it, i) =>
                        i === idx ? { ...it, quantity: Number(it.quantity || 0) + 1 } : it
                    );
                }
                return [...prev, { ...product, quantity: 1, price: Number(product.price || 0) }];
            });
            return;
        }
        try {
            console.debug('addToCart request', { productId: product._id, qty: 1 });
            const res = await fetch(`${API_BASE}/cart/add`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Add to cart failed: ${res.status} ${text}`);
            }
            await fetchServerCart();
        } catch (err) {
            console.error('addToCart error', err);
            setAuthError(err.message || 'Could not add to cart');
        }
    };

    const fetchServerCart = async () => {
        try {
            const res = await fetch(`${API_BASE}/cart`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error(`Failed to fetch server cart: ${res.status}`);
            const data = await res.json();
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
                    await fetch(`${API_BASE}/cart/add`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId: item._id, quantity: item.quantity || 1 }),
                    });
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
        if (!user) {
            setCart(prev =>
                prev
                    .map(item =>
                        item._id === productId
                            ? { ...item, quantity: Math.max(0, Number(item.quantity || 0) + Number(change)) }
                            : item
                    )
                    .filter(item => Number(item.quantity) > 0)
            );
            return;
        }

        // Logged-in: get current item
        const curr = cart.find(i => i._id === productId);
        if (!curr) return;

        const prevQty = Number(curr.quantity || 0);
        const newQty = prevQty + Number(change);

        // if new qty would be 0 or less, remove from server
        if (newQty <= 0) {
            await handleServerRemove(productId);
            return;
        }

        // optimistic UI update
        setCart(prev => prev.map(item => item._id === productId ? { ...item, quantity: newQty } : item));

        try {
            // IMPORTANT: send **delta** (change) — not absolute newQty,
            // because API /cart/add expects an increment amount (like addToCart does).
            // Send numeric change so server increments/decrements correctly.
            console.debug('updateQuantity request', { productId, change: Number(change) });
            const res = await fetch(`${API_BASE}/cart/add`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: Number(change) }), // <-- send change (±1)
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Update quantity failed: ${res.status} ${text}`);
            }
            // refresh canonical server cart
            await fetchServerCart();
        } catch (err) {
            console.error('updateQuantity error', err);
            // rollback to previous server quantity we read (prevQty)
            setCart(prev =>
                prev
                    .map(item => item._id === productId ? { ...item, quantity: prevQty } : item)
                    .filter(item => Number(item.quantity) > 0)
            );
        }
    };


    const handleServerRemove = async (productId) => {
        try {
            const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server remove failed: ${res.status} ${text}`);
            }
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
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/cart/clear`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                setCart([]);
                return;
            }
        } catch (err) {
            console.warn('cart/clear not supported, falling back', err);
        }
        try {
            const serverCart = await fetchServerCart();
            for (const item of serverCart) {
                try {
                    await fetch(`${API_BASE}/cart/remove/${item._id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                } catch (err) {
                    console.error('Failed to delete item during clear fallback', item, err);
                }
            }
            await fetchServerCart();
        } catch (err) {
            console.error('clearCart fallback failed', err);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage products={products} isLoading={isLoading} setCurrentPage={setCurrentPage} addToCart={addToCart} onOpen={(id) => { setCurrentProductId(id); setCurrentPage('product'); }} isSearchModalOpen={isSearchModalOpen} setIsSearchModalOpen={setIsSearchModalOpen} />;
            case 'product':
                return <ProductDetail id={currentProductId} addToCart={addToCart} setCurrentPage={setCurrentPage} />;
            case 'login':
                return <LoginPage setCurrentPage={setCurrentPage} setAuthError={setAuthError} setUser={setUser} setAuthToken={setAuthToken} />;
            case 'register':
                return <RegisterPage setCurrentPage={setCurrentPage} setAuthError={setAuthError} setUser={setUser} setAuthToken={setAuthToken} />;
            case 'profile':
                return <ProfilePage user={user} authToken={authToken} setAuthError={setAuthError} setCurrentPage={setCurrentPage} />;
            case 'admin-dashboard':
                return <AdminDashboardPage products={products} setProducts={setProducts} authToken={authToken} setAuthError={setAuthError} setCurrentPage={setCurrentPage} />;
            case 'cart':
                return <CartPage cart={cart} setCurrentPage={setCurrentPage} updateQuantity={updateQuantity} removeItem={removeItem} clearCart={clearCart} />;
            case 'checkout':
                return <CheckoutPage cart={cart} setCurrentPage={setCurrentPage} clearCart={clearCart} />;
            default:
                return <HomePage products={products} isLoading={isLoading} setCurrentPage={setCurrentPage} addToCart={addToCart} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <header className="bg-stone-800 shadow-md">
                <div className="container mx-auto px-4 flex justify-between items-center py-4">
                    <a href="#" onClick={() => setCurrentPage('home')} className="text-amber-100 text-2xl font-serif font-bold tracking-widest">ARTISAN</a>
                    <nav className='flex items-center space-x-6'>
                        <button onClick={() => setIsSearchModalOpen(true)} className='text-amber-100 border border-1 rounded-full px-4 py-1 flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search</span>
                        </button>
                        <ul className="flex space-x-6 text-amber-100">
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
                                    <li><button onClick={() => setCurrentPage('profile')} className="hover:text-amber-300 font-medium transition-colors">Profile</button></li>
                                    {user.isAdmin && <li><button onClick={() => setCurrentPage('admin-dashboard')} className="hover:text-amber-300 font-medium transition-colors">Admin</button></li>}
                                    <li><button onClick={handleLogout} className="hover:text-amber-300 font-medium transition-colors">Logout</button></li>
                                </>
                            ) : (
                                <li><button onClick={() => setCurrentPage('login')} className="hover:text-amber-300 font-medium transition-colors">Login</button></li>
                            )}
                            <li>
                                <button onClick={() => setCurrentPage('cart')} className="relative hover:text-amber-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.198 1.704.707 1.704H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cart.length > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-stone-800 transform translate-x-1/2 -translate-y-1/2 bg-amber-100 rounded-full">{cart.length}</span>
                                    )}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {currentPage === 'home' && (
                <div className="relative w-full h-92 sm:h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden">
                    <img src="https://media.craftmaestros.com/media/magefan_blog/Elevate_Your_Home_Decor_With_Craft_Maestros.jpg" alt="Hero" className="absolute top-[-220px] w-full h-[calc(100% + 200px)] object-cover" />
                    <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                        <div className="text-center text-white px-4 max-w-3xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-4 leading-tight tracking-wide">Handcrafted Goods for a Thoughtful Home</h1>
                            <p className="text-base sm:text-lg md:text-xl font-light mb-8 max-w-xl mx-auto">Discover our curated collection of unique items made with intention by skilled artisans.</p>
                            <button onClick={() => setCurrentPage('home')} className="bg-amber-100 text-stone-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition-colors shadow-lg">Explore the Collection</button>
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
