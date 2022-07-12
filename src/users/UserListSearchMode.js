import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

function UserListSearchMode({ control }) {
  return (
    <Controller
      name="searchMode"
      control={control}
      render={({ field }) => (
        <FormControl {...field} sx={{ paddingLeft: 2, boxShadow: 2 }}>
          <RadioGroup row {...field}>
            <FormControlLabel
              value="name"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 14,
                      color: "#FFFFFF",
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: 14, color: "#ffffff" }}>
                  Name
                </Typography>
              }
            />
            <FormControlLabel
              value="location"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 14,
                      color: "#FFFFFF",
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: 14, color: "#ffffff" }}>
                  Location
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
      )}
    />
  );
}

export default UserListSearchMode;
