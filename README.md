
# Chattter

![Tests](https://github.com/[onikhalid]/[altschool-semester3-capstone]/workflows/Run%20Tests/badge.svg)

Chattter is a multi-functional platform designed for authors and readers to create, access, and engage with text-based content. In an age dominated by visual media, Chattter aims to be a haven for traditional bookworms and text enthusiasts, challenging established platforms like Hashnode and Medium. With a focus on personalized content discovery, social interaction, and detailed analytics, Chattter aspires to revolutionize the blogging experience.

## Features

### 1. User Registration and Authentication
- **Email & Password Login**: Users can sign up and log in using their email addresses.
- **Google Authentication**: Seamless sign-up and login through Google accounts.

### 2. User Profiles
- **Customizable Profiles**: Users can upload profile photos, set usernames, and select tags/interests to follow.

### 3. Content Creation
- **Rich Text Editor**: Write and publish blog posts with ease using a Markdown-powered editor.
- **Multimedia Support**: Enhance posts with images and videos.
- **SEO Optimization**: Dynamically generate metadata, including OG images and descriptions for better SEO.
- **Post Management**: Authors can edit and delete their posts as needed.

### 4. Content Discovery
- **Personalized Feed**: A "For You" section that curates content based on the user's interests and reading history.
- **Browsing & Searching**: Explore content by categories, tags, or search for specific posts and authors.

### 5. Social Features
- **Interaction**: Users can like, comment, reply, and bookmark posts.
- **Following System**: Users can follow other users and interests to receive updates and recommendations.

### 6. Analytics
- **Dashboard**: Authors have access to detailed analytics, including views, likes, comments, and bookmarks.
- **Data Visualization**: Engagement metrics are displayed through charts, cards, and tables.

### 7. Additional Features
- **Dark/Light Theme Toggle**: Users can switch between light and dark modes.
- **SEO Optimization**: Metadata is dynamically generated for better search engine indexing.

## Technologies Used

- **Frontend**: React, TypeScript, Next.js
- **UI Components**: Shadcn UI, Radix UI
- **Backend**: Firebase for authentication, Firestore for data storage
- **Data Management**: TanStack React Query for efficient data fetching
- **Testing**: Cypress for E2E and unit tests
- **Version Control**: GitHub for source control

## Opportunities for Improvement and Scalability
- **Bookmark Management**: Implementing folders where users can store and organize bookmarks.
- **Enhanced Search Capabilities**: Expanding the search functionality to include more filters and sorting options.

## Installation and Setup

1. Clone the repository from GitHub:
    ```bash
    git clone https://github.com/onikhalid/altschool-semester3-capstone.git
    ```
2. Navigate to the project directory:
    ```bash
    cd altschool-semester3-capstone
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up Firebase for authentication and Firestore for the database.
5. Run the development server:
    ```bash
    npm run dev
    ```

## Testing

- To run unit tests:
    ```bash
    npm run test
    ```
- To run E2E tests:
    ```bash
    npm run cypress:run
    ```

---
