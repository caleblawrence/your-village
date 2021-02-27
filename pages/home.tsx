import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import { Button, Paper } from "@material-ui/core";
import { useState } from "react";
import * as React from "react";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const Home = (): JSX.Element => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  const [selectedDate, handleDateChange] = useState<Date | null>(null);

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Layout>
        <Paper
          elevation={3}
          style={{
            padding: 15,
            backgroundColor: "rgb(28 29 33)",
            marginTop: 20,
          }}
        >
          <h1 style={{ margin: 0, padding: 0, marginBottom: 10 }}>
            Enter a date you need free
          </h1>
          <DateTimePicker
            label="Date/Time"
            inputVariant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ width: 300, display: "block" }}
            disablePast
            fullWidth
          />

          <TextField
            variant="outlined"
            label="How many hours"
            style={{ marginTop: 20, width: 300, display: "block" }}
            fullWidth
          ></TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => console.log("hi")}
            size="medium"
            style={{ marginTop: 10, display: "block" }}
          >
            Submit
          </Button>
        </Paper>
      </Layout>
    </MuiPickersUtilsProvider>
  );
};

export default Home;
