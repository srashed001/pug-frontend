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
  const myUser = useSelector((state) => state.my.user);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


    const resource = value === 0 ? <UpdateUserDetailsForm bio={myUser} /> : <UpdatePasswordForm />
    return (
      <Stack>
        <UploadImageCard bio={myUser} />
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="update profile options"
          sx={{boxShadow: 3}}
          centered
        >
          <Tab icon={<PersonIcon />} label="profile" />
          <Tab icon={<KeyIcon />} label="password" />
        </Tabs>
        {resource}
      </Stack>
    );

}

export default EditProfile;
