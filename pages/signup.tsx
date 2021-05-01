import React, { useState } from "react";
import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import { Alert } from "@material-ui/lab";

const Signup = () => {
  const { mutateUser } = useUser({
    redirectTo: "/home",
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="signup" style={{ maxWidth: 500 }}>
          {errors.map((error) => (
            <Alert
              severity="error"
              icon={false}
              style={{
                marginBottom: 20,
                backgroundColor: "rgb(53 8 0)",
                color: "rgb(255 215 212)",
              }}
            >
              {error}
            </Alert>
          ))}

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

          <p style={{ marginTop: 30 }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#4b8ef5", fontWeight: 800 }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
