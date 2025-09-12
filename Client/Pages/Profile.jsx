import { useEffect, useState } from "react";

const ProfilePage = ({ user, authToken, setAuthError, setCurrentPage, handleLogout, cart = [], goBack = () => window.history.back() }) => {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const normalizeUser = (u) => {
    if (!u) return { displayName: "", email: "" };
    let first = "", last = "";
    if (typeof u.fullname === "string") {
      const parts = u.fullname.trim().split(/\s+/);
      first = parts[0] || "";
      last = parts.slice(1).join(" ") || "";
    } else {
      const nameObj = u.fullname || u.fullName || {};
      first = nameObj.firstname || nameObj.firstName || nameObj.fname || "";
      last = nameObj.lastname || nameObj.lastName || nameObj.lname || "";
    }
    const displayName = `${first} ${last}`.trim() || u.email || u.username || "User";
    const email = u.email || u.username || "";
    return { displayName, email };
  };

  const { displayName, email } = normalizeUser(user || {});

  const cartCount = (Array.isArray(cart) ? cart.reduce((s, it) => s + (Number(it.quantity) || 1), 0) : 0);
  const cartTotal = (Array.isArray(cart) ? cart.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0) : 0);

  const handleBack = () => {
    if (typeof setCurrentPage === "function") setCurrentPage("home");
    else goBack();
  };

  const openLogoutConfirm = () => setConfirmLogoutOpen(true);
  const closeLogoutConfirm = () => setConfirmLogoutOpen(false);

  const doLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (typeof handleLogout === "function") {
        await handleLogout();
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        if (typeof setCurrentPage === "function") setCurrentPage("home");
      }
    } catch (err) {
      console.error("Logout failed", err);
      setAuthError && setAuthError("Logout failed. Try again.");
    } finally {
      setIsLoggingOut(false);
      setConfirmLogoutOpen(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto p-6">
      <button
        onClick={handleBack}
        className="mb-4 text-sm text-stone-800/80 hover:underline flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
          <path d="M19 12H5" />
          <path d="M12 19L5 12L12 5" />
          <title>back</title>
        </svg>
        <span className="font-bold">Back</span>
      </button>
      <div className="w-full md:w-1/2 mx-auto max-w-3xl flex flex-col gap-6">
        <section className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 ">
            <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-xl font-bold text-stone-700">
              {(displayName && displayName[0]) ? displayName[0].toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{displayName || "User"}</h2>
              <p className="text-sm text-gray-500">{email || "No email provided"}</p>
            </div>
          </div>

          
        </section>
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-3">Account</h3>
          <ul className="flex flex-col gap-3">
            <li>
              <button onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("orders") : null} disabled className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition flex justify-between">
                <span>My Orders</span><span className="text-sm text-gray-500">View</span>
              </button>
            </li>
            <li>
              <button onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("addresses") : null} disabled className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition flex justify-between">
                <span>Saved Addresses</span><span className="text-sm text-gray-500">Manage</span>
              </button>
            </li>
            <li>
              <button onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("payment") : null} disabled className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition flex justify-between">
                <span>Payment Methods</span><span className="text-sm text-gray-500">Manage</span>
              </button>
            </li>
            <li>
              <button onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("support") : null} disabled className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition flex justify-between">
                <span>Help & Support</span><span className="text-sm text-gray-500">Contact</span>
              </button>
            </li>
          </ul>
        </section>
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">My Cart</h3>
            <span className="text-sm text-gray-500">{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
          </div>

          {(!Array.isArray(cart) || cart.length === 0) ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <ul className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                {cart.map((it, i) => (
                  <li key={it._id ?? i} className="flex items-center gap-3">
                    <img src={it.image || `https://placehold.co/80x80/a855f7/ffffff?text=${encodeURIComponent(it.name || 'Item')}`} alt={it.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{it.name || "Item"}</div>
                      <div className="text-sm text-gray-500">{(it.quantity ?? 1)} × ₹{(Number(it.price || 0)).toFixed(2)}</div>
                    </div>
                    <div className="font-semibold">₹{(Number(it.price || 0) * (Number(it.quantity || 1))).toFixed(2)}</div>
                  </li>
                ))}
              </ul>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("cart") : null} className="flex-1 bg-white border px-4 py-2 rounded-full">View Cart</button>
                <button onClick={() => typeof setCurrentPage === "function" ? setCurrentPage("checkout") : null} className="flex-1 bg-stone-800 text-amber-100 font-bold px-4 py-2 rounded-full">Proceed to Checkout</button>
              </div>
            </>
          )}
        </section>
        <div className="w-full flex justify-center mt-6">
          <button onClick={openLogoutConfirm} className="px-5 py-2 rounded-full border text-red-600">Logout</button>
        </div>
      </div>
      {confirmLogoutOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeLogoutConfirm} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
            <h3 className="text-lg font-bold">Log out?</h3>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to log out of your account?</p>
            <div className="mt-4 flex gap-3">
              <button onClick={doLogout} disabled={isLoggingOut} className={`px-4 py-2 rounded-full font-semibold ${isLoggingOut ? 'bg-gray-300 text-gray-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                {isLoggingOut ? 'Logging out...' : 'Yes, log out'}
              </button>
              <button onClick={closeLogoutConfirm} disabled={isLoggingOut} className="px-4 py-2 rounded-full border">
                Cancel
              </button>
            </div>
            <button onClick={closeLogoutConfirm} className="absolute top-3 right-3 text-gray-500">✖</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;
