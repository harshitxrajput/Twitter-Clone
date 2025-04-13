# Twitter Clone Documentation

Access the deployed website here: [https://harshitrajput-twitterclone.onrender.com](https://harshitrajput-twitterclone.onrender.com)

---

## Overview

This project is a full-stack Twitter clone built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It replicates core functionalities of Twitter, such as user authentication, posting tweets, liking, commenting, following/unfollowing users, and notifications. The project is styled using Tailwind CSS and DaisyUI and leverages Cloudinary for image uploads.

---

## Technologies Used

### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **DaisyUI**: A Tailwind CSS component library for pre-styled UI components.
- **React Router**: For client-side routing.
- **TanStack React Query**: For efficient server state management and caching.
- **React Icons**: For scalable vector icons.

### Backend
- **Node.js**: A JavaScript runtime for building the server-side application.
- **Express.js**: A web framework for Node.js.
- **MongoDB**: A NoSQL database for storing user, post, and notification data.
- **Mongoose**: An ODM library for MongoDB.
- **Cloudinary**: A cloud-based service for image storage and manipulation.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **bcrypt.js**: For password hashing.

---

## Backend Routes

### Authentication Routes (`/api/auth`)
1. **POST `/signup`**  
   - Registers a new user.  
   - **Request Body**:
     ```json
     {
       "username": "johndoe",
       "fullname": "John Doe",
       "email": "johndoe@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "_id": "64f8c2e5b5a6f2b3c8d9e1a2",
       "username": "johndoe",
       "fullname": "John Doe",
       "email": "johndoe@example.com",
       "followers": [],
       "following": [],
       "profileImg": "",
       "coverImg": "",
       "bio": "",
       "link": ""
     }
     ```

2. **POST `/login`**  
   - Logs in an existing user.  
   - **Request Body**:
     ```json
     {
       "username": "johndoe",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "_id": "64f8c2e5b5a6f2b3c8d9e1a2",
       "username": "johndoe",
       "fullname": "John Doe",
       "email": "johndoe@example.com",
       "followers": [],
       "following": [],
       "profileImg": "",
       "coverImg": "",
       "bio": "",
       "link": ""
     }
     ```

3. **GET `/logout`**  
   - Logs out the current user.  
   - **Response**:
     ```json
     {
       "error": "Logged Out successfully"
     }
     ```

4. **GET `/profile`**  
   - Fetches the profile of the logged-in user.  
   - **Response**:
     ```json
     {
       "_id": "64f8c2e5b5a6f2b3c8d9e1a2",
       "username": "johndoe",
       "fullname": "John Doe",
       "email": "johndoe@example.com",
       "followers": [],
       "following": [],
       "profileImg": "",
       "coverImg": "",
       "bio": "",
       "link": ""
     }
     ```

---

### User Routes (`/api/user`)
1. **GET `/profile/:username`**  
   - Fetches the profile of a user by their username.  
   - **Response**:
     ```json
     {
       "_id": "64f8c2e5b5a6f2b3c8d9e1a2",
       "username": "johndoe",
       "fullname": "John Doe",
       "followers": [],
       "following": [],
       "profileImg": "",
       "coverImg": "",
       "bio": "",
       "link": ""
     }
     ```

2. **GET `/suggested`**  
   - Fetches a list of suggested users to follow.  
   - **Response**:
     ```json
     [
       {
         "_id": "64f8c2e5b5a6f2b3c8d9e1a3",
         "username": "janedoe",
         "fullname": "Jane Doe",
         "profileImg": ""
       }
     ]
     ```

3. **POST `/follow/:id`**  
   - Follows or unfollows a user by their ID.  
   - **Response**:
     ```json
     {
       "message": "User followed successfully"
     }
     ```

4. **POST `/update`**  
   - Updates the profile of the logged-in user.  
   - **Request Body**:
     ```json
     {
       "fullname": "John Doe Updated",
       "bio": "Updated bio",
       "link": "https://example.com"
     }
     ```
   - **Response**:
     ```json
     {
       "_id": "64f8c2e5b5a6f2b3c8d9e1a2",
       "fullname": "John Doe Updated",
       "bio": "Updated bio",
       "link": "https://example.com"
     }
     ```

---

### Post Routes (`/api/post`)
1. **GET `/all`**  
   - Fetches all posts.  
   - **Response**:
     ```json
     [
       {
         "_id": "64f8c2e5b5a6f2b3c8d9e1a4",
         "text": "Hello World!",
         "user": {
           "_id": "64f8c2e5b5a6f2b3c8d9e1a2",
           "username": "johndoe"
         },
         "likes": [],
         "comments": []
       }
     ]
     ```

2. **GET `/all/followingposts`**  
   - Fetches posts from users the logged-in user is following.  
   - **Response**: Same as `/all`.

3. **POST `/create`**  
   - Creates a new post.  
   - **Request Body**:
     ```json
     {
       "text": "This is a new post",
       "img": "base64-image-data"
     }
     ```
   - **Response**:
     ```json
     {
       "_id": "64f8c2e5b5a6f2b3c8d9e1a5",
       "text": "This is a new post",
       "img": "https://cloudinary.com/image.jpg"
     }
     ```

4. **POST `/like/:id`**  
   - Likes or unlikes a post by its ID.  
   - **Response**:
     ```json
     ["64f8c2e5b5a6f2b3c8d9e1a2"]
     ```

5. **POST `/comment/:id`**  
   - Adds a comment to a post.  
   - **Request Body**:
     ```json
     {
       "text": "Nice post!"
     }
     ```
   - **Response**:
     ```json
     {
       "_id": "64f8c2e5b5a6f2b3c8d9e1a4",
       "comments": [
         {
           "text": "Nice post!",
           "user": "64f8c2e5b5a6f2b3c8d9e1a2"
         }
       ]
     }
     ```

---

### Notification Routes (`/api/notification`)
1. **GET `/all`**  
   - Fetches all notifications for the logged-in user.  
   - **Response**:
     ```json
     [
       {
         "_id": "64f8c2e5b5a6f2b3c8d9e1a6",
         "type": "follow",
         "from": {
           "_id": "64f8c2e5b5a6f2b3c8d9e1a3",
           "username": "janedoe"
         }
       }
     ]
     ```

2. **DELETE `/delete`**  
   - Deletes all notifications for the logged-in user.  
   - **Response**:
     ```json
     {
       "message": "All notifications deleted successfully"
     }
     ```

---

## Functionality

1. **User Authentication**: Users can sign up, log in, and log out securely using JWT.
2. **Profile Management**: Users can update their profile, including uploading profile and cover images.
3. **Post Creation**: Users can create posts with text and images.
4. **Like and Comment**: Users can like/unlike posts and add comments.
5. **Follow/Unfollow**: Users can follow or unfollow other users.
6. **Notifications**: Users receive notifications for likes and follows.
7. **Suggested Users**: Displays a list of suggested users to follow.

---

## Instructions to Build and Run the Project

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Twitter-Clone
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   npm install --prefix frontend
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Build the Project**:
   ```bash
   npm run build
   ```

5. **Start the Production Server**:
   ```bash
   npm start
   ```

---

## Conclusion

This Twitter Clone project demonstrates the use of modern web development technologies to build a scalable and feature-rich application. The project is designed to be user-friendly and efficient, with a focus on performance and maintainability.