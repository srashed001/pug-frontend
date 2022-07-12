import { FormHelperText, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Controller } from "react-hook-form";

function UserListNameSearch({ control }) {
  return (
    <Box sx={{ padding: 1, boxShadow: "1px 1px 5px #161A1D" }}>
      <Controller
        name="nameQuery"
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
              search by name
            </FormHelperText>
          </>
        )}
      />
    </Box>
  );
}

export default UserListNameSearch;
