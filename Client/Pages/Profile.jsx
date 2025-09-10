import { useState, useEffect } from "react";

const ProfilePage = ({ user, authToken, setAuthError, setUser, onLogout, setCurrentPage,goBack = () => window.history.back() }) => {
  // Read cart from localStorage for UI display (safe fallback if parent doesn't pass it)
  const [cart, setCart] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    } catch (e) {
      setCart([]);
    }
  }, []);

  // - user.fullname as string
  const getDisplayName = (u) => {
    if (!u) return "";
    if (typeof u.fullname === "string") return u.fullname;
    if (typeof u.fullName === "string") return u.fullName;
    const fn = u.fullname || u.fullName || {};
    const first = fn.firstname || fn.firstName || fn.fname || "";
    const last = fn.lastname || fn.lastName || fn.lname || "";
    const joined = `${first} ${last}`.trim();
    if (joined) return joined;
    // fallback to email or a generic label
    return u.email || "User";
  };

  const displayName = getDisplayName(user);
  const email = user?.email || "";

  const cartCount = cart.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 1)), 0);

  // Default logout behaviour if parent didn't provide onLogout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (typeof onLogout === "function") {
        // let parent handle logout (preferred)
        await onLogout();
      } else {
        // Minimal client-side logout so refresh doesn't auto-login
        // (You can extend this to call backend /logout here later)
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        setUser && setUser(null);
        // optionally navigate to home if setCurrentPage exists
        if (typeof setCurrentPage === "function") setCurrentPage("home");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setAuthError && setAuthError("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
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
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: user info */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>

          <div className="mb-4">
            <p className="text-gray-700 text-sm">Full name</p>
            <p className="text-gray-900 font-semibold text-lg">{displayName || "—"}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 text-sm">Email</p>
            <p className="text-gray-900">{email || "—"}</p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Middle column: quick links / account options */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Account</h3>

          <ul className="space-y-3">
            <li>
              <button
                onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("orders") : null}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition flex justify-between items-center"
              >
                <span>My Orders</span>
                <span className="text-sm text-gray-500">View</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("addresses") : null}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition flex justify-between items-center"
              >
                <span>Saved Addresses</span>
                <span className="text-sm text-gray-500">Manage</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("payment") : null}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition flex justify-between items-center"
              >
                <span>Payment Methods</span>
                <span className="text-sm text-gray-500">Manage</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("support") : null}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition flex justify-between items-center"
              >
                <span>Help & Support</span>
                <span className="text-sm text-gray-500">Contact</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Right column: cart summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">My Cart</h3>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div>
              <ul className="space-y-3 max-h-48 overflow-y-auto">
                {cart.map((item, idx) => (
                  <li key={item._id ?? idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{item.name || item.title || "Item"}</p>
                      <p className="text-sm text-gray-500">{item.quantity ?? 1} × ${((item.price ?? 0)).toFixed(2)}</p>
                    </div>
                    <div className="text-gray-800 font-semibold">${(((item.price ?? 0) * (item.quantity ?? 1))).toFixed(2)}</div>
                  </li>
                ))}
              </ul>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-semibold">Items ({cartCount})</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("cart") : null}
                  className="w-full bg-stone-800 text-amber-100 font-bold py-2 px-4 rounded-full hover:bg-stone-700 transition"
                >
                  View Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
