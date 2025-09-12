const RegisterPage = ({ setCurrentPage }) => (
  <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">Full Name</label>
          <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="fullname" type="text" placeholder="Full Name" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="email" type="email" placeholder="Email" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700" id="password" type="password" placeholder="Password" />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
            Register
          </button>
          <button onClick={() => setCurrentPage('login')} type="button" className="font-bold text-sm text-purple-600 hover:text-purple-800">
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  </main>
);

export default RegisterPage;
