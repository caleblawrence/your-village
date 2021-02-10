import React, { useState } from "react";
import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import fetchJson from "../lib/fetchJson";
import { Button, TextField } from "@material-ui/core";

const Login = () => {
  const { mutateUser } = useUser({
    redirectTo: "/profile",
    redirectIfFound: true,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const body = {
      email,
      password,
    };

    try {
      let data = await fetchJson("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await mutateUser(data);
    } catch (error) {
      console.error("An unexpected error happened:", error);
      setErrorMsg(error.data.message);
    }
  };

  return (
    <Layout>
      <div className="login">
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          style={{ marginBottom: 20 }}
        />
        <TextField
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          type="password"
          autoComplete="current-password"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          size="large"
          style={{ marginTop: 10, display: "block" }}
        >
          Login
        </Button>

        {errorMsg !== "" && <p>{errorMsg}</p>}
      </div>
      <style jsx>{`
        .login {
        }
      `}</style>
    </Layout>
  );
};

export default Login;
