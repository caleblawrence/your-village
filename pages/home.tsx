import useUser from "../lib/useUser";
import Layout from "../components/Layout";
import { IUser } from "../types/IUser";
import { Button, Paper, Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import * as React from "react";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { Alert, Skeleton } from "@material-ui/lab";
import { Opportunity, User } from "@prisma/client";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

const Home = (): JSX.Element => {
  let data = useUser({ redirectTo: "/login" });
  let user: IUser = data.user;
  const [selectedDate, handleDateChange] = useState<Date | null>(null);
  const [hours, setHours] = useState<Number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoadingMyTimes, setIsLoadingMyTimes] = useState(false);
  const [myRequestedTimes, setMyRequestedTimes] = useState<
    (Opportunity & {
      babySitter: User;
    })[]
  >([]);

  useEffect(() => {
    if (user == null || user.id == undefined) return;
    getMyRequestedTimes();
  }, [user]);

  async function getMyRequestedTimes() {
    setIsLoadingMyTimes(true);
    const myRequestTimesResponse = await axios.get(`/api/my-requested-times`);
    setMyRequestedTimes(myRequestTimesResponse.data.requestedTimes);
    setIsLoadingMyTimes(false);
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  if (!user || user.isLoggedIn === false) {
    return <Layout>loading...</Layout>;
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/new-opportunity", {
        date: selectedDate,
        hours: hours,
      });
      setOpen(true);
      setHours("");
      handleDateChange(null);
      getMyRequestedTimes();
    } catch (error) {
      console.log("error adding opportunity");
    }
    setIsLoading(false);
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
            onChange={(e) => setHours(e.target.value)}
            fullWidth
          ></TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="medium"
            style={{ marginTop: 10, display: "block" }}
            disabled={hours === null || selectedDate == null || isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>

          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Oppertunity created! You will recieve an email when/if someone
              says they can babysit for you.
            </Alert>
          </Snackbar>
        </Paper>

        <Paper
          elevation={3}
          style={{
            padding: 15,
            backgroundColor: "rgb(28 29 33)",
            marginTop: 20,
          }}
        >
          <h1 style={{ margin: 0, padding: 0 }}>My requested dates</h1>
          {isLoadingMyTimes && (
            <div style={{ width: 300 }}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          )}
          {myRequestedTimes.length === 0 && !isLoadingMyTimes && (
            <p style={{ margin: 0, padding: 0, color: "rgb(204 204 204)" }}>
              You don't have any requested dates
            </p>
          )}
          {myRequestedTimes.map((time) => {
            return (
              <div key={time.id} style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 20, margin: 0, padding: 0 }}>
                  {format(new Date(time.date), "LLL do, yyyy h:mm aaa")} for{" "}
                  {time.hours} hours
                </p>
                {time.babySitter !== null && (
                  <p style={{ margin: 0, padding: 0 }}>
                    {time.babySitter.name} is babysitting.
                  </p>
                )}
                {time.babySitter === null && (
                  <p style={{ margin: 0, padding: 0 }}>
                    No one has volunteered for this yet.
                  </p>
                )}
              </div>
            );
          })}
        </Paper>
      </Layout>
    </MuiPickersUtilsProvider>
  );
};

export default Home;
