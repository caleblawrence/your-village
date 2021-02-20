import React, { useEffect, SetStateAction, useState, Dispatch } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PersonIcon from "@material-ui/icons/Person";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { User } from "@prisma/client";
import axios from "axios";
import useDebounce from "./useDebounce";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

interface Props {
  setFriendToAdd: Dispatch<SetStateAction<User>>;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}

function SearchUsers(props: Props) {
  const { setFriendToAdd, inputValue, setInputValue } = props;
  const classes = useStyles();
  const [options, setOptions] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(inputValue, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      axios
        .get(`/api/search-users?name=${debouncedSearchTerm}`)
        .then(function (response) {
          setIsSearching(false);
          if (response?.data?.users === []) {
            setOptions([]);
          } else {
            setOptions(response.data.users);
          }
        });
    } else {
      setOptions([]);
    }
  }, [debouncedSearchTerm]);

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
      inputValue={inputValue}
      onChange={(event: any, newValue: User | null) => {
        setOptions([]);
        setFriendToAdd(newValue);
        setInputValue("");
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Name"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isSearching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
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
