
# Learning Management System Backend : 

This is the backend for a Learning Management System (LMS) designed to handle user authentication, course management, subscription services, and various administrative functionalities. It is built using Node.js and Express.js, and uses MongoDB as the database.

## Features

### 1. User Authentication

- **`/register`**: Allows users to register with the system. Accepts user details including an optional avatar.
- **`/login`**: Handles user login.
- **`/logout`**: Logs out the currently logged-in user.
- **`/me`**: Retrieves the profile of the currently logged-in user.
- **`/forgotPassword`**: Initiates the process of resetting a forgotten password.
- **`/resetPassword/:resetToken`**: Resets the password using a reset token.
- **`/changePassword`**: Allows a logged-in user to change their password.
- **`/update/:id`**: Updates user details, including an optional avatar.

### 2. Course Management

- **`/` (GET)**: Retrieves all courses.
- **`/` (POST)**: Creates a new course (requires ADMIN role).
- **`/:id` (GET)**: Retrieves lectures for a specific course, requires user authentication and subscriber authorization.
- **`/:id` (PUT)**: Updates course details (requires ADMIN role).
- **`/:id` (DELETE)**: Removes a course (requires ADMIN role).
- **`/:id` (POST)`/lectures`**: Adds a new lecture to a course (requires ADMIN role).
- **`/:courseId/lectures/:lectureId` (DELETE)**: Removes a lecture from a course (requires ADMIN role).

### 3. Subscription Services

- **`/subscribe`**: Allows a user to buy a subscription.
- **`/verify`**: Verifies a user's subscription.
- **`/unsubscribe`**: Cancels a user's subscription.

### 4. Payment and Statistics

- **`/razorpay-key`**: Retrieves the Razorpay API key.
- **`/` (GET)**: Retrieves all payments (requires ADMIN role).
- **`/contact` (POST)**: Handles user contact form submissions.
- **`/admin/stats/users` (GET)**: Retrieves statistics related to users (requires ADMIN role).

## Technologies Used

- **bcryptjs**: Password hashing for user authentication.
- **cloudinary**: Cloud-based image and video management for handling avatars.
- **cookie-parser**: Parses cookies for handling user sessions.
- **cors**: Enables Cross-Origin Resource Sharing.
- **dotenv**: Loads environment variables from a .env file.
- **express**: Web framework for Node.js.
- **jsonwebtoken**: Generates and verifies JSON Web Tokens for user authentication.
- **mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **morgan**: HTTP request logger middleware.
- **multer**: Middleware for handling multipart/form-data, used for file uploads.
- **nodemailer**: Sends emails, used for password reset functionality.
- **nodemon**: Monitors for changes and automatically restarts the server during development.
- **razorpay**: Payment gateway integration for handling subscriptions.

## Testing with Thunder Client

[Thunder Client](https://www.thunderclient.io/) is a powerful API testing tool for Visual Studio Code. You can use Thunder Client to test the API endpoints of this backend.

1. Install Thunder Client extension in Visual Studio Code.
2. Open Thunder Client and create a new HTTP request collection.
3. Start testing the API endpoints by sending requests to the corresponding URLs.

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables in a `.env` file.
4. Start the server using `npm start` or `nodemon`.

Feel free to explore the codebase for more detailed implementation and configuration details. For any issues or feature requests, please create an issue on the [GitHub repository](https://github.com/SwapnilVG/Backend-Project.git). Contributions are welcome!
