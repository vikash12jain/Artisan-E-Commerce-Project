import { useState, useEffect } from 'react';

// API base URL for our backend server
const API_BASE_URL = 'http://localhost:4000/api';

// Sample product data will be replaced by API call
const sampleProducts = [
    { _id: '1', name: 'Handcrafted Mug', price: 24.99, category: 'Pottery' },
    { _id: '2', name: 'Woven Scarf', price: 45.00, category: 'Textiles' },
    { _id: '3', name: 'Silver Ring', price: 79.50, category: 'Jewelry' },
    { _id: '4', name: 'Wooden Bowl', price: 32.75, category: 'Woodworks' },
    { _id: '5', name: 'Ceramic Vase', price: 55.00, category: 'Pottery' },
    { _id: '6', name: 'Leather Journal', price: 68.00, category: 'Stationery' },
    { _id: '7', name: 'Glass Pendant', price: 95.00, category: 'Jewelry' },
    { _id: '8', name: 'Embroidered Pillow', price: 42.00, category: 'Home Decor' },
];

const ProductCard = ({ product, addToCart }) => (
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
                <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                <button
                    onClick={() => addToCart(product)}
                    className="bg-stone-800 text-amber-100 font-medium py-2 px-4 rounded-full hover:bg-stone-700 transition-colors duration-300 shadow-md"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
);

const HomePage = ({ products, isLoading, setCurrentPage, addToCart }) => (
    <main className="flex-grow container mx-auto p-8">
        <div className="text-center my-8">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to Artisan Crafts</h1>
            <p className="mt-2 text-lg text-gray-600">Explore our amazing handcrafted goods!</p>
        </div>

        <section className="my-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">New Arrivals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <p className="text-center col-span-full text-gray-500">Loading products...</p>
                ) : (
                    products.slice(0, 4).map(product => <ProductCard key={product._id} product={product} addToCart={addToCart} />)
                )}
            </div>
        </section>

        <section className="my-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Top Selling</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <p className="text-center col-span-full text-gray-500">Loading products...</p>
                ) : (
                    products.slice(4, 8).map(product => <ProductCard key={product._id} product={product} addToCart={addToCart} />)
                )}
            </div>
        </section>
    </main>
);

const CartPage = ({ cart, setCurrentPage, updateQuantity, removeItem, clearCart }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main className="flex-grow container mx-auto p-8">
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
                                    <img src={`https://placehold.co/100x100/a855f7/ffffff?text=${item.name.replace(/ /g, '+')}`} alt={item.name} className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => updateQuantity(item._id, -1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700">-</button>
                                    <span className="font-bold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, 1)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700">+</button>
                                </div>
                                <button onClick={() => removeItem(item._id)} className="ml-4 text-red-500 hover:text-red-700">
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
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="mt-6 flex flex-col space-y-4">
                            <button
                                onClick={() => setCurrentPage('checkout')}
                                className="w-full bg-stone-800 text-amber-100 font-bold py-3 px-4 rounded-full hover:bg-stone-700 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-full hover:bg-red-600 transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
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
        // Simulate a checkout process with a delay
        setTimeout(async () => {
            await clearCart();
            setIsPlacingOrder(false);
            setOrderPlaced(true);
            setTimeout(() => {
                setCurrentPage('home');
            }, 3000); // Redirect after 3 seconds
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
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center py-2 text-xl font-bold mt-4">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthError('');
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed.');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setAuthToken(data.token);
            setCurrentPage('home');
        } catch (error) {
            setAuthError(error.message);
            console.error("Login failed:", error);
        }
    };

    return (
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-stone-800 hover:bg-stone-700 text-amber-100 font-bold py-2 px-4 rounded-full" type="submit">
                            Sign In
                        </button>
                        <button onClick={() => setCurrentPage('register')} type="button" className="font-bold text-sm text-stone-800 hover:text-stone-600">
                            Create an account
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const RegisterPage = ({ setCurrentPage, setAuthError, setUser, setAuthToken }) => {
    const [fullName, setFullName] = useState({ firstname: '', lastname: '' });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthError('');
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed.');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setAuthToken(data.token);
            setCurrentPage('home');
        } catch (error) {
            setAuthError(error.message);
            console.error("Registration failed:", error);
        }
    };

    return (
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">First Name</label>
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="fullname" type="text" placeholder="First Name" value={fullName.firstname} onChange={(e) => setFullName({...fullName, firstname: e.target.value })} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Last Name</label>
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="lastname" type="text" placeholder="Last Name" value={fullName.lastname} onChange={(e) => setFullName({...fullName, lastname: e.target.value })} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-stone-800 hover:bg-stone-700 text-amber-100 font-bold py-2 px-4 rounded-full" type="submit">
                            Register
                        </button>
                        <button onClick={() => setCurrentPage('login')} type="button" className="font-bold text-sm text-stone-800 hover:text-stone-600">
                            Already have an account?
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const ProfilePage = ({ user, authToken, setAuthError }) => {
    const [fullName, setFullName] = useState(user?.fullName || { firstname: '', lastname: '' });
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdate = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ fullName, email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Profile update failed.');
            }

            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            setMessage('Profile updated successfully!');
        } catch (error) {
            setAuthError(error.message);
            setMessage('Failed to update profile.');
            console.error("Profile update failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">My Profile</h2>
                {user ? (
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">First Name</label>
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="fullname" type="text" value={fullName.firstname} onChange={(e) => setFullName({ ...fullName, firstname: e.target.value })} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">Last Name</label>
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="lastname" type="text" value={fullName.lastname} onChange={(e) => setFullName({ ...fullName, lastname: e.target.value })} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                            <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="email" type="email" value={email} disabled />
                        </div>
                        {message && <p className={`text-sm text-center mb-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-stone-800 hover:bg-stone-700 text-amber-100 font-bold py-2 px-4 rounded-full disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-center text-gray-500">Loading profile data...</p>
                )}
            </div>
        </main>
    );
};

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [authToken, setAuthToken] = useState(null);
    const [authError, setAuthError] = useState('');

    // Load user and token from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        const storedCart = localStorage.getItem('cart');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setAuthToken(storedToken);
        }
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Product Fetching
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const productsData = await response.json();
                setProducts(productsData);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuthToken(null);
        setUser(null);
        setCart([]);
        setCurrentPage('home');
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id);
        if (existingItem) {
            setCart(cart.map(item =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        setAuthError('');
    };

    const updateQuantity = (productId, change) => {
        setCart(cart.map(item =>
            item._id === productId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        ).filter(item => item.quantity > 0));
    };

    const removeItem = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage products={products} isLoading={isLoading} setCurrentPage={setCurrentPage} addToCart={addToCart} />;
            case 'login':
                return <LoginPage setCurrentPage={setCurrentPage} setAuthError={setAuthError} setUser={setUser} setAuthToken={setAuthToken} />;
            case 'register':
                return <RegisterPage setCurrentPage={setCurrentPage} setAuthError={setAuthError} setUser={setUser} setAuthToken={setAuthToken} />;
            case 'profile':
                return <ProfilePage user={user} authToken={authToken} setAuthError={setAuthError} />;
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
                        <button className='text-amber-100 border border-1 rounded-full px-4 py-1 flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search</span>
                        </button>
                        <ul className="flex space-x-6 text-amber-100">
                            <li><button onClick={() => setCurrentPage('home')} className="hover:text-amber-300 font-medium transition-colors">Shop</button></li>
                            {user ? (
                                <>
                                    <li><button onClick={() => setCurrentPage('profile')} className="hover:text-amber-300 font-medium transition-colors">Profile</button></li>
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
