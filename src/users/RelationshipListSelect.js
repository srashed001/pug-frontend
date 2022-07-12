import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

function RelationshipListSelect({ control }) {
  return (
    <Stack
      component={"form"}
      sx={{
        width: "100%",
        boxShadow: 3,
      }}
    >
      <Controller
        name="relationshipMode"
        control={control}
        render={({ field }) => (
          <FormControl {...field} sx={{ paddingLeft: 2, boxShadow: 2 }}>
            <RadioGroup row {...field}>
              <FormControlLabel
                value="followers"
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
                    followers
                  </Typography>
                }
              />
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
            </RadioGroup>
          </FormControl>
        )}
      />
    </Stack>
  );
}

export default RelationshipListSelect;
