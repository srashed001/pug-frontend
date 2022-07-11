import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import UpdatePasswordForm from "./UpdatePasswordForm";
import UpdateUserDetailsForm from "./UpdateUserDetailsForm";
import UploadImageCard from "./UploadImageCard";
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';

function EditProfile() {
  const my = useSelector((state) => state.my);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

if (my.status === "failed") {
    return <div>{my.error}</div>;
  } else {
    const resource = value === 0 ? <UpdateUserDetailsForm bio={my.user} /> : <UpdatePasswordForm />
    return (
      <Stack>
        <UploadImageCard bio={my.user} />
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example"
          centered
        >
          <Tab icon={<PersonIcon />} label="profile" />
          <Tab icon={<KeyIcon />} label="password" />
        </Tabs>
        {resource}
      </Stack>
    );
  }
}

export default EditProfile;
