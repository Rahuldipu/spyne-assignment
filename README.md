# Social Media Application
# Overview
This project is a social media application built with Node.js and MongoDB. It allows users to sign up, log in, create and manage posts, follow other users, comment on posts, like posts and comments, and view counts of posts. It also supports uploading images to AWS S3.

# Prerequisites
Node.js
MongoDB
AWS Account (for S3)
Docker (optional, for containerization)
Environment Variables
Create a .env file in the root of your project and set the following environment variables:

env
Copy code
# MongoDB
MONGO_URI=mongodb://localhost:27017

# JWT
JWT_SECRET=your_jwt_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name

# Ports
PORT=3000

# Installation
Clone the Repository: git clone https://github.com/Rahuldipu/spyne-assignment.git
cd spyne-assignment

# Install Dependencies:
Navigate to each service directory and install the dependencies:
npm install

# Run:
Start server by running the following command in the respective directory:
npm start

# AWS S3 Image Upload
Ensure that your AWS credentials and bucket name are correctly set in the environment variables.
