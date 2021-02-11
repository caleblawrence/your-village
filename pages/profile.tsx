import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import SearchUsers from "../components/SearchUsers";

const SgProfile = () => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      <h1>Your profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <h3>Add friends</h3>
      <SearchUsers />
    </Layout>
  );
};

export default SgProfile;
