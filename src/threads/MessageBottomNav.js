import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import { useState } from "react";
import MessageInput from "../threads/MessageInput";

export default function MessageBottomNav() {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ width: "80%" }}>
      <BottomNavigation
        showLabels
        sx={{ width: "100%", position: "fixed", bottom: 0 }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <MessageInput />
      </BottomNavigation>
    </Box>
  );
}
