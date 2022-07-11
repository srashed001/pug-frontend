import {
  Box,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import statesArr from "../common/50states";

function UserListLocationSearch({ control }) {
  return (
    <Grid container sx={{ padding: 1, boxShadow: "1px 1px 5px #161A1D" }}>
      <Grid item xs>
        <Controller
          name="cityQuery"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                size="small"
                sx={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  boxShadow: 3,
                  borderRadius: 1,
                  fontSize: 10,
                }}
                {...field}
              />
              <FormHelperText sx={{ color: "#ffffff" }}>
                search by city
              </FormHelperText>
            </>
          )}
        />
      </Grid>
      <Grid item paddingLeft={0.5}>
        <Controller
          name="stateQuery"
          control={control}
          variant="standard"
          render={({ field }) => (
            <>
              <Select
                size="small"
                sx={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  boxShadow: 3,
                  borderRadius: 1,
                }}
                {...field}
              >
                {statesArr.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: "#ffffff" }}>
                search by state
              </FormHelperText>
            </>
          )}
        />
      </Grid>
    </Grid>
  );
}

export default UserListLocationSearch;
