import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage"
import LoginForm from "../forms/LoginForm"
import SignupForm from "../forms/SignupForm";
import GamesList from "../games/GamesList";
import UsersList from "../users/UsersList";
import GameDetails from "../games/GameDetails";
import UserDetails from "../users/UserDetails";

function Routes({login, signup}){
    
    return (
        <div>
            <Switch>

                <Route exact path="/">
                    <Homepage />
                </Route>

                <Route exact path="/login">
                    <LoginForm login={login} />
                </Route>

                <Route exact path="/signup">
                    <SignupForm signup={signup} />
                </Route>

                <Route exact path="/games">
                    <GamesList />
                </Route>

                <Route exact path="/user">
                    <UsersList />
                </Route>

                <Route exact path="/games/:gameId">
                    <GameDetails />
                </Route>

                <Route exact path="/users/:username">
                    <UserDetails />
                </Route>
            </Switch>
        </div>
    )
}

export default Routes