# Social🌐


This Node.js backend project provides a comprehensive set of APIs for managing users, posts, comments, and replies within an application. Here's a summary of what the project does:

1) User Management:

- SignUp: Allows users to register a new account with their personal details. Passwords are hashed for security.

- SignIn: Authenticates users with their credentials, ensuring confirmation of their email  and that the account is not deleted.

- Profile Management: Users can view and update their profile information, including their email, password, and phone number.

- Profile Picture and Cover Photo: Users can upload and manage their profile picture and cover photo. New images override existing ones.

- SoftDelete Profile: Allows users to deactivate their accounts, soft deleting their profiles.

- Forget Password: Provides functionality for users to reset forgotten passwords with a time-limited code.

- Token Refresh: Allows users to refresh their authentication token for continued access to protected endpoints.

2) Comment Management:
- Add Post: Users can create new posts, including text content and optional images or videos.

- Update and Delete Post: Post owners can update or delete their own posts. Deletion removes associated comments and deletes images from the hosting service (Cloudinary).

- Privacy Settings: Users can set the privacy level of their posts (public or private).

- Like and Unlike Post: Users can like posts, with each user allowed to like a post only once.

- Get Posts: Users can retrieve posts with their associated comments, excluding those from deleted users.

3) Reply Management:
- Add Reply: Users can reply to comments, subject to post and user activity status.
- Update and Delete Reply: Reply owners can update or delete their replies.
- Like and Unlike Reply: Users can like replies, with each user allowed to like a reply only once.

4) Scheduled Functionality:
- A scheduled function runs daily at 9:00 PM to send reminder emails to users who haven't confirmed their email addresses, encouraging them to avoid account deletion.

This project enforces good practices such as using HTTP status codes, Joi validation, global error handling, authentication for all requests, password hashing, and encryption of sensitive data like phone numbers. It provides a robust backend foundation for building a secure and feature-rich application.


## To run this project

Set up environment variables:
Create a `.env` file in the root directory.
Add necessary `environment variables`.

Installation:
- Install dependencies using npm
```bash
   npm i init
   node index.js
```

- OR run using nodemon
```bash
   nodemon
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`DB_ATLAS`
`DB_USERNAME`
`DB_PASSWORD`
`DB_DBNAME`
`salt_round`
`BEARER_KEY`
`page_limit`
`gmail`
`EMAIL_PASSWORD`
`TOKEN_SIGNATURE`
`REFRESH_TOKEN_SIGNATURE`
`encrypt_key`
`api_key`
`api_secret`
`cloud_name`
`page_limit`
## postman-documentation
https://documenter.getpostman.com/view/25070384/2s9YJaYjTe
## Technology Stack
- Technology Stack:
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Cloudinary (for image and video hosting)
- Crypto-js
- Joi
- API Features Class
