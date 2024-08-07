import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";

type State = {
  name: string;
  email: string;
};

export const app = new Frog<{ State: State }>({
  initialState: {
    name: "",
    email: "",
  },
  title: "Frog Frame",
});

//@ts-ignore
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Collect name
app.frame("/", (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ color: "white", fontSize: 60, padding: "0 120px" }}>
          Enter Name
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter Name" />,
      <Button value="next" action="/email">
        Next
      </Button>,
    ],
  });
});

// Collect email
app.frame("/email", (c) => {
  const { buttonValue, deriveState, inputText } = c;
  const state = deriveState((previousState) => {
    if (buttonValue === "next") {
      previousState.name = inputText!;
    }
  });
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ color: "white", fontSize: 60, padding: "0 120px" }}>
          Enter Email
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter Email" />,
      <Button value="next-email" action="/validate-email">
        Next
      </Button>,
    ],
  });
});

// Validate email
app.frame("/validate-email", (c) => {
  const { buttonValue, deriveState, inputText } = c;
  const state = deriveState((previousState) => {
    if (buttonValue === "next-email") {
      previousState.email = inputText!;
    }
  });

  if (!isValidEmail(inputText)) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(to right, #432889, #17101F)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ color: "white", fontSize: 40, padding: "0 120px" }}>
            Invalid email. Please enter a valid email address.
          </div>
        </div>
      ),
      intents: [
        <Button value="retry" action="/email">
          Retry
        </Button>,
      ],
    });
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ color: "white", fontSize: 60, padding: "0 120px" }}>
          Email Validated
        </div>
      </div>
    ),
    intents: [
      <Button value="next" action="/display-info">
        Next
      </Button>,
    ],
  });
});

// User Info
app.frame("/display-info", (c) => {
  const { deriveState } = c;
  const state = deriveState();

  console.log(state.name);
  console.log(state.email);

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            padding: "0 120px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            Name: {state.name}
            <br />
            Email: {state.email}
          </div>
        </div>
      </div>
    ),
    intents: [<Button.Reset>Start Over</Button.Reset>],
  });
});

app.hono.get("/health-check", (c) => {
  return c.text("ALl good!");
});

app.use("/*", serveStatic({ root: "./public" }));
devtools(app, { serveStatic });

if (typeof Bun !== "undefined") {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log("Server is running on port 3000");
}
