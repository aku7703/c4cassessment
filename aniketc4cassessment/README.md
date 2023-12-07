# Code4Community Chat - README

## Overview
This repository contains Aniket Chaudhry's code for the Code4Community Technical Assessment, which involves creating a Minimum Viable Product (MVP) for a global anonymous message board. The web application allows users to post messages, view messages from most to least recent, and interact community anonymously.

## Components and Interactions

### HTML
The HTML file (`index.html`) provides the structure for the web application. It includes links to Google Fonts, Font Awesome icons, and the Firebase library. The main body is initially empty and dynamically populated based on user interactions.

### JavaScript
The JavaScript file (`index.js`) is responsible for the core functionality of the web application. It utilizes the Firebase Realtime Database to store and retrieve messages. The `AnonymousChat` class is defined, which manages the creation of the home page, chat page, and various UI elements.

### CSS
The CSS file (`index.css`) contains styling rules for the web application, ensuring a visually appealing and responsive user interface. It defines styles for the title, join form, chat container, messages, and other components.

### Firebase
The web application uses Firebase for real-time data storage and retrieval. The Firebase configuration is provided in the JavaScript file, and the `AnonymousChat` class includes methods to save user names, send messages, and refresh the chat.

## Fulfillment of Requirements
- Users can type and post messages (up to 128 characters).
- Messages are displayed from most to least recent.
- Messages persist in the Firebase database and can be viewed by people using different computers. 



## How to Start the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Code4Community-Chat.git
   cd Code4Community-Chat
   
   
 Open index.html in a web browser.

Start interacting with the Code4Community Chat!

## Bonus Features
1. **Profanity Filter:**
   - Messages are checked for profanity using the Profanity Filter API.
   - Inappropriate language is replaced with censoring characters before being saved to the database.
   
2. **Usernames & Log Out:**
   - Users can post under a username they enter (Max 15 Characters!)
   - Users can log out, clearing their stored name and returning to the home page.
   
3. **Timestamping:**
   - Messages will contain a timestamp according to when they were posted. 
   
4. **Hosting:**
    - The project is currently hosted at: https://aniketcc4cassessment.netlify.app/