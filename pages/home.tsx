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
  const [hours, setHours] = useState<Number | null>(null);

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  const handleSubmit = () => {
    console.log("hello");
    // TODO: add babsitting thing
  };

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
            value={hours}
            onChange={(e) => setHours(+e.target.value)}
            type="number"
            fullWidth
          ></TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="medium"
            style={{ marginTop: 10, display: "block" }}
            disabled={hours === null || selectedDate == null}
          >
            Submit
          </Button>
        </Paper>
      </Layout>
    </MuiPickersUtilsProvider>
  );
};

export default Home;
