# E-commerce API Documentation

This document outlines the API endpoints for the E-commerce application.

## Authentication

*   `POST /api/auth/register` - Register a new user.
*   `POST /api/auth/login` - Authenticate user and get a JWT token.
*   `GET /api/auth/profile` (Private) - Get logged-in user's profile.
*   `PUT /api/auth/profile` (Private) - Update logged-in user's profile.

## Products

*   `GET /api/products` (Public) - Get all products. Supports `keyword`, `category`, `subcategory`, `minPrice`, `maxPrice`, `minRating`, `pageNumber` queries.
*   `GET /api/products/:id` (Public) - Get a single product by ID.
*   `POST /api/products` (Private/Admin) - Create a new product.
*   `PUT /api/products/:id` (Private/Admin) - Update a product by ID.
*   `DELETE /api/products/:id` (Private/Admin) - Delete a product by ID.

## Cart

*   `GET /api/cart` (Private/Customer) - Get the logged-in user's cart.
*   `POST /api/cart` (Private/Customer) - Add an item to the cart. Body: `{ productId: '...', quantity: N }`.
*   `PUT /api/cart/:id` (Private/Customer) - Update quantity of an item in the cart. `:id` is the cart item's `_id`. Body: `{ quantity: N }`.
*   `DELETE /api/cart/:id` (Private/Customer) - Remove an item from the cart. `:id` is the cart item's `_id`.

## Orders

*   `POST /api/orders` (Private/Customer) - Create a new order (checkout).
*   `GET /api/orders/myorders` (Private/Customer) - Get all orders for the logged-in user.
*   `GET /api/orders` (Private/Admin, Sales) - Get all orders.
*   `GET /api/orders/:id` (Private) - Get a single order by ID (accessible by owner, admin, sales).
*   `PUT /api/orders/:id/pay` (Private) - Mark order as paid. Body: `{ id, status, update_time, email_address }` (payment gateway result).
*   `PUT /api/orders/:id/deliver` (Private/Admin, Sales) - Mark order as delivered.
*   `PUT /api/orders/:id/status` (Private) - Update order status (e.g., 'cancelled', 'returned' for customer; all for admin/sales). Body: `{ status: '...' }`.

## Reviews

*   `POST /api/products/:id/reviews` (Private/Customer) - Create a new review for a product. Body: `{ rating: N, comment: '...' }`.
*   `GET /api/products/:id/reviews` (Public) - Get all reviews for a specific product.
*   `DELETE /api/reviews/:id` (Private/Customer, Admin) - Delete a review by ID (owner or admin).

## Users (Admin Only)

*   `GET /api/users` (Private/Admin) - Get all users.
*   `GET /api/users/:id` (Private/Admin) - Get user by ID.
*   `PUT /api/users/:id` (Private/Admin) - Update user by ID. Body: `{ name, email, role }`.
*   `DELETE /api/users/:id` (Private/Admin) - Delete user by ID.
*   `PUT /api/admin/settings` (Private/Admin) - Placeholder for configuring system settings.
*   `GET /api/admin/monitor` (Private/Admin) - Placeholder for monitoring system performance.

---

**Note:** All private routes require a valid JWT `Bearer` token in the `Authorization` header.
