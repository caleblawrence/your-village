import Layout from "../components/Layout";
import useUser from "../lib/useUser";
import { IUser } from "../types/IUser";
import { useRouter } from "next/router";
import { Button, TextField } from "@material-ui/core";

const Home = () => {
  const router = useRouter();

  let data = useUser({ redirectTo: "" });
  let user: IUser = data.user;
  if (user?.isLoggedIn === true) {
    router.push("/home");
  }
  return (
    <Layout>
      <h1>Babysitter app</h1>
      <p>Summary</p>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        style={{ marginTop: 10 }}
        href="/login"
      >
        Login
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        style={{ marginTop: 10 }}
        href="/signup"
      >
        Sign up
      </Button>
    </Layout>
  );
};

export default Home;
