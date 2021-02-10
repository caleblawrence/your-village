import useUser from "../lib/useUser";
import Layout from "../components/Layout";

const SgProfile = () => {
  const { user } = useUser({ redirectTo: "/login" });

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      <h1>Your profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  );
};

export default SgProfile;
