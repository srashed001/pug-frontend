import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import LoginForm from "../forms/LoginForm";
import SignupForm from "../forms/SignupForm";
import GamesList from "../games/GamesList";
import UsersList from "../users/UsersList";
import GameDetails from "../games/GameDetails";
import UserDetails from "../users/UserDetails";
import App from "../App";

function PugRoutes({ login, signup }) {
  return (
    <div>
      {/* <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="users" element={<UsersList />}>
            <Route path=":username" element={<UserDetails />} />
          </Route>
          <Route path="games" element={<GamesList />}>
            <Route path=":gameId" element={<GameDetails />} />
          </Route>
          <Route path="login" login={login} element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
        </Route>
      </Routes> */}
    </div>
  );
}

export default PugRoutes;
