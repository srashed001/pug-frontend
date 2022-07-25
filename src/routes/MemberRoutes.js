import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
const GameMapAndDetails = React.lazy(() =>
  import("../games/GameMapAndDetails")
);
const Homepage = React.lazy(() => import("../homepage/Homepage"));
const LoginForm = React.lazy(() => import("../forms/LoginForm"));
const SignupForm = React.lazy(() => import("../forms/SignupForm"));
const UserDetails = React.lazy(() => import("../users/UserDetails"));
const ThreadsList = React.lazy(() => import("../threads/ThreadsList"));
const MessagesList = React.lazy(() => import("../threads/MessagesList"));
const InvitesList = React.lazy(() => import("../invites/InvitesList"));
const EditProfile = React.lazy(() => import("../forms/EditProfile"));
const RelationshipsList = React.lazy(() =>
  import("../users/RelationshipsList")
);
const NewThread = React.lazy(() => import("../threads/NewThread"));
const CreateGameForm = React.lazy(() => import("../forms/CreateGameForm"));
const UpdateGameForm = React.lazy(() => import("../forms/UpdateGameForm"));
const CourtsList = React.lazy(() => import("../courts/CourtsList"));
const GamesList = React.lazy(() => import("../games/GamesList"));
const UsersList = React.lazy(() => import("../users/UsersList"));
const GameInviteList = React.lazy(() => import("../invites/GameInviteList"));
const NotFoundPage = React.lazy(() => import("./NotFoundPage"));

function MemberRoutes({ login, signup }) {


  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/courts" element={<CourtsList />} />

        <Route
          path="/relationships/f/:username"
          element={<RelationshipsList state={"followers"} />}
        />
        <Route
          path="/relationships/g/:username"
          element={<RelationshipsList />}
        />
        <Route path="/invites" element={<InvitesList />} />
        <Route path="/invites/:gameId" element={<GameInviteList />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/threads/new" element={<NewThread />} />
        <Route path="/threads/inbox" element={<ThreadsList />} />
        <Route path="/threads/t/:threadId" element={<MessagesList />} />
        <Route
          path="/login"
          login={login}
          element={<LoginForm login={login} />}
        />
        <Route path="/signup" element={<SignupForm signup={signup} />} />

        <Route path="/users" element={<UsersList />} />

        <Route path="/users/u/:username" element={<UserDetails />} />

        <Route path="/games" element={<GamesList />} />
        <Route path="/games/new" element={<CreateGameForm />} />
        <Route path="/games/g/:gameId" element={<GameMapAndDetails />} />
        <Route path="/games/update/:gameId" element={<UpdateGameForm />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default MemberRoutes;
