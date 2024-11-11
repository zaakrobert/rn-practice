This side project was built as a practice app using React Native, Expo, Tailwind CSS, and Appwrite for the backend database. It’s a fully functional app with features including sign-in, sign-up, and persistent login status.

Features
User Authentication: Sign-in and sign-up functionalities.
Persistent Login: Keeps users logged in across sessions.
Responsive Design: Styled with Tailwind CSS for responsive UI.
Getting Started
Prerequisites
Ensure you have the following installed:

Node.js
Expo CLI
Installation
Clone the repository:

`git clone https://github.com/your-username/rn-practice.git`

`cd rn-practice`

Install dependencies:

`npm install`

Set up Appwrite:
Set up an Appwrite instance and configure your database.
Add your Appwrite endpoint and project credentials in the environment/configuration file (if applicable).

Running the App
To run the app in development mode:

`npx expo start -c`

The app will start, and you can preview it in the Expo Go app or using an emulator.

Technologies Used
React Native: For building the cross-platform app.
Expo: For ease of development and deployment.
Tailwind CSS: For styling the app UI.
Appwrite: For backend and database management.
Folder Structure
```
rn-practice/
├── app/            # Source code
│   ├── index.jsx   # Main app file
│   ├── _layout.jsx # Root Layout
│   ├── (tabs)/     # Screen components (e.g., home, create, bookmark, profile)
│   ├── (auth)/     # Screen components (e.g., sign-in, sign-up)
│   └── search/     # Searching query component
├── assets/         # Images, fonts, and Icons
├── components/     # Reusable UI components
├── constants/      # Define assets and export
├── lib/            # API and database services
└── tailwind.config.js # Tailwind configuration
```


## Credits

This side project was inspired by and built upon concepts learned from [Aora by Adrian Hajdin](https://github.com/adrianhajdin/aora).


## Contributing

If you'd like to contribute, feel free to make a pull request!
