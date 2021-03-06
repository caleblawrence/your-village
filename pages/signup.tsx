import React, { useState } from "react";
import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import fetchJson from "../lib/fetchJson";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";

const Signup = () => {
  const { mutateUser } = useUser({
    redirectTo: "/profile",
    redirectIfFound: true,
  });
  const [errors, setErrors] = useState<String[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const body = {
      name,
      email,
      password,
    };

    try {
      let response = await axios.post("/api/signup", body);
      await mutateUser(response.data);
    } catch (error) {
      console.error("An unexpected error happened:", error.response);
      setErrors(error.response.data.errors);
    }
  };

  return (
    <Layout>
      <div className="signup">
        <TextField
          label="Full name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          style={{ marginBottom: 20 }}
        />
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
          onClick={handleSignup}
          size="large"
          style={{ marginTop: 10, display: "block" }}
          disabled={email === "" || password === "" || name === ""}
        >
          Sign Up
        </Button>

        {errors.map((error) => (
          <p>{error}</p>
        ))}
      </div>
      <style jsx>{`
        .login {
        }
      `}</style>
    </Layout>
  );
};

export default Signup;
