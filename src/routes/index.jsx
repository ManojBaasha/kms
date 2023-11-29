import {
  Form,
} from "react-router-dom";

export default function Index() {
    return (
      <p id="zero-state">
        This is a demo for React Router.
        <br />
        Check out{" "}
        <a href="https://reactrouter.com">
          the docs at reactrouter.com
        </a>
        .
        <Form method="post">
            <button type="submit">New</button>
        </Form>
      </p>
    );
  }