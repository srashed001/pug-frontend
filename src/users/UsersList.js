import { useEffect, useState } from "react";
import PugApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import UserCard from "./UserCard";

function UsersList() {
  console.debug("UsersList");

  const [users, setUsers] = useState(null);

  async function search(data = {}) {
    const users = await PugApi.getUsers(data);
    setUsers(users);
  }

  useEffect(() => {
    console.log("CompanyList useEffect");
    search();
  }, []);

  if (!users) return <LoadingSpinner />;

  console.log(users)

  return (
    <div>
      <h1>GamesList</h1>
      {users.map((u) => (
        <UserCard
          key={u.username}
          username={u.username}
          firstName={u.firstName}
          lastName={u.lastName}
          city={u.city}
          state={u.state}
          profileImg={u.profileImg}
          isPrivate={u.isPrivate}
        />
      ))}
    </div>
  );
}

export default UsersList;
