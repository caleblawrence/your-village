import Layout from "../components/Layout";
import useUser from "../lib/useUser";
import { IUser } from "../types/IUser";
import { useRouter } from "next/router";
import { Button, TextField } from "@material-ui/core";
import Image from "next/image";
import Grid from "@material-ui/core/Grid";

const Home = () => {
  const router = useRouter();

  let data = useUser({ redirectTo: "" });
  let user: IUser = data.user;
  if (user?.isLoggedIn === true) {
    router.push("/home");
  }
  return (
    <Layout>
      <h1>The home for managing your babysitting times</h1>
      <p>
        You can add family and friends and they will be notified whenever you
        need someone to babysit and this app will take care of managing who
        volunteered to help.
      </p>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        style={{ marginTop: 10 }}
        href="/signup"
      >
        Create an account
      </Button>
      <Grid container spacing={3} style={{ marginTop: 40 }}>
        <Grid item xs={12} sm={3}>
          <p style={{ fontSize: 16 }}>
            Manage the times you want free and volunteer to help your friends
            with their kids.
          </p>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Image
            src="/manageTimes.png"
            alt="Picture of the author"
            width={800}
            height={400}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <p style={{ fontSize: 16 }}>
            Add friends and get notified when they add new times
          </p>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Image
            src="/friends.png"
            alt="Picture of the author"
            width={800}
            height={400}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;
