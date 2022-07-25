import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

function HomepageInviteSelect({ control }) {
  return (
    <Controller
      name="inviteMode"
      control={control}
      render={({ field }) => (
        <FormControl {...field} sx={{ paddingLeft: 2, boxShadow: 2 }}>
          <RadioGroup row {...field}>
            <FormControlLabel
              value="received"
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
                  received
                </Typography>
              }
            />
            <FormControlLabel
              value="sent"
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
                  sent
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
      )}
    />
  );
}

export default HomepageInviteSelect;
