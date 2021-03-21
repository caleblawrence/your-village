import Layout from "../components/Layout";
import useUser from "../lib/useUser";
import { IUser } from "../types/IUser";
import { useRouter } from "next/router";
import { Button, TextField } from "@material-ui/core";
import Image from "next/image";

const Home = () => {
  const router = useRouter();

  let data = useUser({ redirectTo: "" });
  let user: IUser = data.user;
  if (user?.isLoggedIn === true) {
    router.push("/home");
  }
  return (
    <Layout>
      <h1>Your Village</h1>
      <h3>"It takes a village to raise a child"</h3>
      <div>
        <Image
          src="/manageTimes.png"
          alt="Picture of the author"
          width={800}
          height={400}
        />
      </div>
      <div>
        <Image
          src="/friends.png"
          alt="Picture of the author"
          width={800}
          height={400}
        />
      </div>

      <Button
        variant="contained"
        color="primary"
        size="medium"
        style={{ marginTop: 10 }}
        href="/signup"
      >
        Create an account
      </Button>
    </Layout>
  );
};

export default Home;
