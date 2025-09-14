# Artisan Shop: E-commerce Application

Welcome to the **Artisan Shop**, a full-stack e-commerce application for artisanal and handcrafted goods. This single-page web application is a showcase of a robust online store solution, built to provide a seamless shopping experience for unique, handmade products.

## Project Title

**Artisan-E-Commerce-Project**

## Features ✨

* **User Authentication:** Secure user registration and login are handled with **JSON Web Tokens (JWT)**, ensuring a personalized and secure shopping experience.
* **Product Management:** A complete set of **CRUD (Create, Read, Update, Update, Delete)** APIs allows for easy management of products. Users can browse and filter unique artisanal products by categories and price.
* **Inventory Management:** The backend includes a simple yet effective system to track and manage product inventory, ensuring that customers are aware of the stock levels of each unique item.
* **Persistent Shopping Cart:** The shopping cart is a core feature. It allows users to add or remove items, and the cart's contents persist even after a user logs out, providing a seamless shopping experience.
* **Profile Page:** Users can view and manage their personal information in a dedicated profile section.
* **Product Detail Page:** Each product has its own page for detailed information, images, and the option to add it to the cart.
* **Admin Panel:** A dedicated dashboard for the administrator to have full control over all products, including adding, updating, and deleting items.
* **Intuitive User Interface:** The frontend is a **Single-Page Application (SPA)**, providing a smooth and responsive user experience. It includes dedicated pages for:
    * **Login & Signup:** Simple and secure access for users.
    * **Product Listing:** Browse and filter a curated selection of artisanal goods.
    * **Cart:** A dedicated page to review, add, or remove items before checkout.
    * **Checkout:** A placeholder page for a future payment gateway integration.

## Technologies Used 💻

This project is built on the **MERN (MongoDB, Express.js, React, Node.js)** stack, a powerful combination for building modern web applications.

* **MongoDB:** A NoSQL database used to store all product, user, and cart data.
* **Express.js:** A minimalist web framework for Node.js, used to build the backend APIs.
* **React:** A JavaScript library for building the user interface.
* **Node.js:** A JavaScript runtime used to build the backend server.

## Live Demo 🚀

You can check out the live application here: [http://artisan-store.netlify.app/](http://artisan-store.netlify.app/)

## Setup and Installation

To get this project up and running on your local machine, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/vikash12jain/Artisan-E-Commerce-Project](https://github.com/vikash12jain/Artisan-E-Commerce-Project)
    ```

2.  **Backend Setup:**
    ```bash
    cd Server
    npm install
    ```
    Create a `.env` file in the `Server` directory and add your MongoDB connection string and JWT secret.
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
    Then, run the server:
    ```bash
    npm start
    ```

3.  **Frontend Setup:**
    Open a new terminal, navigate to the frontend directory, and install dependencies.
    ```bash
    cd Client
    npm install
    ```
    Then, run the client application:
    ```bash
    npm run dev
    ```

The application will now be running on `http://localhost:5173`.

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## Contact

For any suggestions or doubts, please reach out at [Vikash12jain@gmail.com](mailto:Vikash12jain@gmail.com).
