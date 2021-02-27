import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import { Paper } from "@material-ui/core";
import { useState } from "react";
import * as React from "react";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const Home = () => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  const [selectedDate, handleDateChange] = useState<Date | null>(new Date());

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Layout>
        <h1>Home</h1>
        <Paper
          elevation={3}
          style={{
            padding: 15,
            backgroundColor: "rgb(28 29 33)",
            marginTop: 20,
          }}
        >
          <h1>Enter a date you need free</h1>
          <DateTimePicker
            // @ts-expect-error
            renderInput={(props) => <TextField variant="outlined" {...props} />}
            label="DateTimePicker"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Paper>
      </Layout>
    </MuiPickersUtilsProvider>
  );
};

export default Home;
