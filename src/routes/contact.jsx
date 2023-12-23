/**
 * File: Contact.js
 * Description: This file defines the Contact component, which displays contact information and chat messages.
 * The component includes features for editing, deleting, and marking a contact as a favorite. It also handles
 * user prompts and messages within a chat interface.
 *
 * Author: Manoj Elango [melango@ucdavis.edu]
 */

import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";
import "./contact.css";
import React, { useState } from "react";
import { db, auth } from "../../firebaseconfigs";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const initialMessages = [
  {
    user: "user1",
    text: "Explain quantum computing in simple terms",
  },
  {
    user: "user2",
    text: "Certainly! Quantum computing is a new type of computing that relies on the principles of quantum physics...",
  },
  {
    user: "user1",
    text: "What are three great applications of quantum computing?",
  },
  {
    user: "user2",
    text: "Three great applications of quantum computing are: Optimization of complex problems, Drug Discovery, and Cryptography.",
  },
];

/**
 * Loader function for fetching contact details based on the contactId parameter.
 * Throws a 404 error if the contact is not found.
 * @param {Object} params - The route parameters, including contactId.
 * @returns {Object} - Object containing the fetched contact details.
 */
export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}

/**
 * Action function for updating the favorite status of a contact based on the form data.
 * @param {Object} options - Options object containing the request and params.
 * @returns {Promise} - Promise representing the updateContact operation.
 */
export async function action({ request, params }) {
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

/**
 * Contact component for displaying contact information and chat messages.
 * Also includes options for editing, deleting, and marking as a favorite.
 */
export default function Contact() {
  const { contact } = useLoaderData();
  const contacts = {
    first: "Your",
    last: "Name",
    avatar: "https://placekitten.com/g/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };
  const [messages, setMessages] = useState(initialMessages);
  const renderMessages = () => {
    return messages.map((message, index) => (
      <div
        key={index}
        className={`flex items-start${
          message.user === "user2" ? " flex-row-reverse" : ""
        }`}
      >
        <img
          className="mr-2 h-8 w-8 rounded-full"
          src={`https://dummyimage.com/128x128/363536/ffffff&text=${message.user.charAt(
            0
          )}`}
        />
        <div
          className={`flex min-h-[85px] rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl${
            message.user === "user2" ? " ml-auto" : ""
          }`}
        >
          <p>{message.text}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="chat-container">
      <div className="contact-info">
        <div className="sub-contact-info1">
          <img
            key={contact.avatar}
            src={contact.avatar || null}
            alt="Contact Avatar"
          />
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          {contact.twitter && (
            <p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://twitter.com/${contact.twitter}`}
              >
                {contact.twitter}
              </a>
            </p>
          )}
          <Favorite contact={contact} />
        </div>
        <div className="sub-contact-info2">
          {contact.notes && <p>{contact.notes}</p>}
          <div className="button-container">
            <Form action="edit">
              <button type="submit">Edit</button>
            </Form>
            <Form
              method="post"
              action="destroy"
              onSubmit={(event) => {
                if (
                  !window.confirm(
                    "Please confirm you want to delete this record."
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              <button type="submit">Delete</button>
            </Form>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {/* Prompt Messages Container - Modify the height according to your need */}
        <div className="flex h-[85vh] w-full flex-col">
          {/* Prompt Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-300 sm:text-base sm:leading-7">
            {renderMessages()}
          </div>
          {/* Prompt message input */}
          <form className="mt-2">
            <label htmlFor="chat-input" className="sr-only">
              Enter your prompt
            </label>
            <div className="relative">
              <button
                type="button"
                className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"></path>
                  <path d="M5 10a7 7 0 0 0 14 0"></path>
                  <path d="M8 21l8 0"></path>
                  <path d="M12 17l0 4"></path>
                </svg>
                <span className="sr-only">Use voice input</span>
              </button>
              <textarea
                id="chat-input"
                className="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-600 sm:text-base"
                placeholder="Enter your prompt"
                rows="1"
                required
              ></textarea>
              <button
                type="submit"
                className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
              >
                Send <span className="sr-only">Send message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * Component: Favorite
 * Description: This component represents the favorite button for a contact.
 * It utilizes the useFetcher hook to handle form submissions and updates the contact's favorite status accordingly.
 * The button toggles between a filled star (★) and an empty star (☆) based on the contact's favorite status.
 * @param {Object} contact - Contact information
 * @returns {JSX.Element} - Favorite button component
 */
function Favorite({ contact }) {
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
