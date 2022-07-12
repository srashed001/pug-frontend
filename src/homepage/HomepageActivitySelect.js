import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

function HomepageActivitySelect({ control }) {
  return (
    <Stack
      component={"form"}
      sx={{
        width: "100%",
        backgroundColor: "#F24346",
        position: "fixed",
        top: "6.5rem",
        zIndex: "10",
        boxShadow: 3,
      }}
    >
      <Controller
        name="activityMode"
        control={control}
        render={({ field }) => (
          <FormControl {...field} sx={{ paddingLeft: 2, boxShadow: 2 }}>
            <RadioGroup row {...field}>
              <FormControlLabel
                value="following"
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
                    following
                  </Typography>
                }
              />
              <FormControlLabel
                value="personal"
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
                    personal
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        )}
      />
    </Stack>
  );
}

export default HomepageActivitySelect;
