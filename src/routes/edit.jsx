/**
 * File: edit.jsx
 * Description: This file represents the Edit Contact page in the React application.
 * It provides a form for editing contact information, allowing users to modify details such as name, Twitter handle,
 * avatar URL, and additional notes. The form includes options to save changes or cancel the editing process.
 * Author: Manoj Elango [melango@ucdavis.edu]
 */
import { Form, useLoaderData, redirect, useNavigate, } from "react-router-dom";
import { updateContact } from "../contacts";

/**
 * Action function called upon form submission, updating contact information and redirecting to the contact details page.
 * @param {Object} request - Form data from the submitted request
 * @param {Object} params - Route parameters
 * @returns {Promise<Object>} - Redirects to the updated contact details page
 */
export async function action({ request, params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
}

/**
 * Component: EditContact
 * Description: React component for the Edit Contact page.
 * Renders a form with fields for editing contact information and provides options to save changes or cancel the editing process.
 * @returns {JSX.Element} - Edit Contact form component
 */
export default function EditContact() {
    const { contact } = useLoaderData();
    const navigate = useNavigate();

    return (
        <Form method="post" id="contact-form">
            <p>
                <span>Name</span>
                <input
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                    name="first"
                    defaultValue={contact.first}
                />
                <input
                    placeholder="Last"
                    aria-label="Last name"
                    type="text"
                    name="last"
                    defaultValue={contact.last}
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    type="text"
                    name="twitter"
                    placeholder="@jack"
                    defaultValue={contact.twitter}
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Avatar URL"
                    type="text"
                    name="avatar"
                    defaultValue={contact.avatar}
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea
                    name="notes"
                    defaultValue={contact.notes}
                    rows={6}
                />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button" onClick={() => {
                    navigate(-1);
                }}>Cancel</button>
            </p>
        </Form>
    );
}