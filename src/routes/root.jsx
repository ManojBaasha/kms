/**
 * File: root.jsx
 * Description: This file represents the root page of the React application.
 * It serves as the main navigation hub, displaying a sidebar with a list of contacts, a search bar, and options to create a new contact.
 * Contacts are listed in a navigation menu, and selecting a contact displays its details in the main content area.
 * Author: Manoj Elango [melango@ucdavis.edu]
 */

import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation, } from "react-router-dom";
import { getContacts, createContact, updateContact } from "../contacts";

/**
 * Loader function to fetch the initial list of contacts.
 * @returns {Object} - Object containing the list of contacts
 */
export async function loader() {
    const contacts = await getContacts();
    return { contacts };
}


/**
 * Component: Root
 * Description: React component for the Root page, serving as the main navigation hub.
 * @returns {JSX.Element} - Root page component
 */
export default function Root() {
    const { contacts } = useLoaderData();
    const navigation = useNavigation();
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={true}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </form>
                    <Link to={`/`}>
                    <button type="submit">New</button>
                    </Link>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.groupID}>
                                    <NavLink
                                        to={`contacts/${contact.groupID}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        <Link to={`contacts/${contact.groupID}`}>
                                            {contact.first || contact.last ? (
                                                <>
                                                    {contact.first} {contact.last}
                                                </>
                                            ) : (
                                                <i>No Name</i>
                                            )}{" "}
                                            {contact.favorite && <span>★</span>}
                                        </Link>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
                {navigation.state === "loading" ? (
                    <div className="loading-bar">Loading...</div>
                ) : (
                    <Outlet />
                )}
            </div>
        </>
    );
}