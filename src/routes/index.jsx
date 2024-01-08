import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation, } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import Cookies from "universal-cookie";
import { getContacts, createContact, updateContact } from "../contacts";
import localforage from "localforage";

const cookies = new Cookies();

const animalNames = [
  "fox", "lion", "tiger", "mouse", "crab",
  "elephant", "giraffe", "zebra", "penguin", "koala",
  "dolphin", "panda", "cheetah", "parrot", "kangaroo",
  "octopus", "sloth", "owl", "rhinoceros", "polar bear",
  // Add more names as needed
];
const notes = [
  "ghoster", "boring", "weirdo", "sophomore", "math major",
  "adventurous", "creative", "optimistic", "introverted", "extroverted",
  "curious", "ambitious", "artistic", "tech-savvy", "bookworm",
  "go-getter", "easygoing", "energetic", "daydreamer", "foodie",
  // Add more notes as needed
];
const avatars = ["https://pfps.gg/assets/pfps/6826-yipeee.png", "https://picsum.photos/200"];


/**
 * Action function to create a new contact and redirect to its edit page.
 * @returns {Promise<Object>} - Redirects to the edit page of the newly created contact
 */
export async function action() {
  //currently shifted all of its contents to LoadingScreen  
}

const handleSignIn = async (setIsAuth) => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    cookies.set("auth-token", result.user.refreshToken);
    setIsAuth(true);
    localforage.setItem('email', result.user);

    // The signed-in user info.
    const user = result.user;

    // IdP data available using getAdditionalUserInfo(result)
    // ...
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;

    // The email of the user's account used.
    const email = error.customData?.email;

    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);

    // Handle the error as needed...
    console.log(errorMessage);
  }
};

export default function Index() {
  const { contacts } = useLoaderData();
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  


  const LoadingScreen = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      setIsLoading(true); // Set loading to true before creating contact

    let contact = await createContact();

      // Redirect after the contact is created
      window.location.href = `/contacts/${contact.groupID}/`;
    } catch (error) {
      console.error("Error creating contact:", error);
    } finally {
      setIsLoading(false); // Set loading to false after the operation is complete
    }
  };

  // Step 3: Conditionally render loading state
  if (isLoading) {
    return <p>Loading...</p>;
  }


  if (!isAuth) {
    return (
      <div className="auth">
        <p> Sign In With Google To Continue </p>
        <button onClick={() => handleSignIn(setIsAuth)}>  Sign In </button>
      </div>
    );
  }

  return (
    <p id="zero-state">
      This is a demo for React Router.
      <br />
      Check out{" "}
      <a href="https://reactrouter.com">the docs at reactrouter.com</a>.
      <Form method="post">
        <button type="submit" onClick={LoadingScreen} >New</button>
      </Form>
    </p>
  );
}
