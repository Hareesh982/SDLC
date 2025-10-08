# E-commerce Application

This is a boilerplate for an e-commerce application built with Node.js, Express, and MongoDB.

## Features (based on User Stories):

*   **Product Browsing:** Search by keyword, filter by category/subcategory, and price range. Display product ratings.
*   **Product Purchasing:** Shopping cart functionality (add/remove items, update quantity), checkout process, order creation.
*   **Order Management (Customer):** View personal order history, track order status, cancel/return orders.
*   **Order Management (Sales/Admin):** View all orders, update order status (process payments, fulfill orders).
*   **User Account Management (Admin):** View, update, and delete user accounts, configure system settings, monitor performance.
*   **Product Reviews & Ratings:** Customers can leave reviews and ratings, display on product pages, filter by rating.

## Tech Stack:

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (via Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens), Bcrypt.js for password hashing
*   **Environment Variables:** Dotenv
*   **Emailing:** Nodemailer (with Ethereal for development)

## Setup and Run:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd e-commerce-app
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following (update with your actual values):
    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/ecommerce-app
    JWT_SECRET=aVeryStrongSecretKeyForJWTThatShouldBeLongerAndRandom

    # For email sending (e.g., using Ethereal.email for testing)
    EMAIL_HOST=smtp.ethereal.email
    EMAIL_PORT=587
    EMAIL_USER=your_ethereal_email@ethereal.email
    EMAIL_PASS=your_ethereal_password
    ```
    *   `MONGO_URI`: Your MongoDB connection string. If running locally, ensure MongoDB is running.
    *   `JWT_SECRET`: A strong, random string for JWT signing.
    *   `EMAIL_USER`/`EMAIL_PASS`: For `EMAIL_HOST=smtp.ethereal.email`, you can get temporary credentials from [Ethereal Mail](https://ethereal.email/) for development.

4.  **Run the application:**
    *   **Development mode (with nodemon for auto-restart):**
        ```bash
        npm run dev
        ```
    *   **Production mode:**
        ```bash
        npm start
        ```

    The server will start on `http://localhost:5000` (or your specified `PORT`).

## Testing:

To run tests (currently boilerplate):

```bash
npm test
```

## API Documentation:

Refer to `docs/API.md` for API endpoints and usage (to be filled out).
