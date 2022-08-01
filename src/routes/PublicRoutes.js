import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
const GameMapAndDetails = React.lazy(() =>
  import("../games/GameMapAndDetails")
);
const Homepage = React.lazy(() => import("../homepage/Homepage"));
const LoginForm = React.lazy(() => import("../forms/LoginForm"));
const SignupForm = React.lazy(() => import("../forms/SignupForm"));
const UserDetails = React.lazy(() => import("../users/UserDetails"));
const RelationshipsList = React.lazy(() =>
  import("../users/RelationshipsList")
);
const CourtsList = React.lazy(() => import("../courts/CourtsList"));
const GamesList = React.lazy(() => import("../games/GamesList"));
const UsersList = React.lazy(() => import("../users/UsersList"));
const NotFoundPage = React.lazy(() => import("./NotFoundPage"));
const CredentialsRequiredPage = React.lazy(() =>
  import("./CredentialsRequiredPage")
);

function PublicRoutes({ login, signup }) {
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
        <Route path="/invites" element={<CredentialsRequiredPage />} />
        <Route path="/invites/:gameId" element={<CredentialsRequiredPage />} />
        <Route path="/editProfile" element={<CredentialsRequiredPage />} />
        <Route path="/threads/new" element={<CredentialsRequiredPage />} />
        <Route path="/threads/inbox" element={<CredentialsRequiredPage />} />
        <Route
          path="/threads/t/:threadId"
          element={<CredentialsRequiredPage />}
        />
        <Route
          path="/login"
          login={login}
          element={<LoginForm login={login} />}
        />
        <Route path="/signup" element={<SignupForm signup={signup} />} />

        <Route path="/users" element={<UsersList />} />

        <Route path="/users/u/:username" element={<UserDetails />} />

        <Route path="/games" element={<GamesList />} />
        <Route path="/games/new" element={<CredentialsRequiredPage />} />
        <Route path="/games/g/:gameId" element={<GameMapAndDetails />} />
        <Route
          path="/games/update/:gameId"
          element={<CredentialsRequiredPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default PublicRoutes;
