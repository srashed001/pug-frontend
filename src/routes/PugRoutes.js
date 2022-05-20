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
import ThreadsList from "../threads/ThreadsList";
import MessagesList from "../threads/MessagesList";
import InvitesList from "../invites/InvitesList";
import EditProfile from "../forms/EditProfile";
import RelationshipsList from "../users/RelationshipsList";
import NewThread from "../threads/NewThread";
import GameInvite from "../invites/GameInvite";
import CreateGameForm from "../forms/CreateGameForm";

function PugRoutes({ login, signup }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />      
        <Route path="/relationships/:username" element={<RelationshipsList />} />
        <Route path="/invites" element={<InvitesList />} />  
        <Route path="/invites/:gameId" element={<GameInvite />} />  
        <Route path="/editProfile" element={<EditProfile />} />  
        <Route path="/threads/new" element = {<NewThread />} />
        <Route path="/threads/inbox" element = {<ThreadsList />} />
        <Route path="/threads/t/:threadId" element = {<MessagesList />} />
        <Route path="/login" login={login} element={<LoginForm login={login} />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:username" element={<UserDetails />} />
   
        <Route path="/games" element={<GamesList />} />
        <Route path="/games/new" element={<CreateGameForm />} />
        <Route path="/games/g/:gameId" element={<GameDetails />} />
      

      </Routes>
    </div>
  );
}

export default PugRoutes;
