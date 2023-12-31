/**
 * File: main.js
 * Description: This file serves as the entry point for the React application.
 * This is the main rooting page which consists of the navigation and operations for edit, delete and create converations.
 * Most places refer to "contact" which describes the conact of the person you're having the conversation with.
 * 
 * Author: Manoj Elango [melango@ucdavis.edu]
 */

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import ErrorPage from "./error-page";
import EditContact, { action as editAction, } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index , { action as rootAction } from "./routes/index";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root, { loader as rootLoader} from "./routes/root";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJTxAQFBZiwppBWHV0RSaHnGBZnHbYi78",
  authDomain: "omeglebutbetter.firebaseapp.com",
  projectId: "omeglebutbetter",
  storageBucket: "omeglebutbetter.appspot.com",
  messagingSenderId: "430697048260",
  appId: "1:430697048260:web:7f5a05c6a9fa50719f4191",
  measurementId: "G-DDG1TELN2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader, // gets all the contacts and display it in ascending order on the screen 
    children: [
      {
        errorElement: <ErrorPage />,
        children: [

          {
            index: true,
            element: <Index />,
            loader: rootLoader, // gets all the contacts and display it in ascending order on the screen 
            action: rootAction, // function to create a new contact page 
          },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
        ]
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <RouterProvider router={router} />
  </React.StrictMode>
);