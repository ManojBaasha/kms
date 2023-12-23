import { Form } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

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
  
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

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
        <button type="submit">New</button>
      </Form>
    </p>
  );
}
