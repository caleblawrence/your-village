import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";

const Home = () => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      <h1>Home</h1>
    </Layout>
  );
};

export default Home;
