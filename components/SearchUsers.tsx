import React, { useEffect, useMemo, useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PersonIcon from "@material-ui/icons/Person";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import { User } from "@prisma/client";
import axios from "axios";
import useDebounce from "./useDebounce";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

function SearchUsers() {
  const classes = useStyles();
  const [value, setValue] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(inputValue, 1000);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        axios
          .get(`/api/search-users?name=${debouncedSearchTerm}`)
          .then(function (response) {
            setIsSearching(false);

            console.log("user", response?.data?.users);
            if (response?.data?.users == undefined) {
              setOptions([]);
            } else {
              setOptions(response.data.users);
            }
          });
      } else {
        setOptions([]);
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedSearchTerm]
  );

  return (
    <Autocomplete
      style={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event: any, newValue: User | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Name" variant="outlined" fullWidth />
      )}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center">
            <Grid item>
              <PersonIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                {option.name}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default SearchUsers;
