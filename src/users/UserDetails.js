import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import PugApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";

function UserDetails(){

    const {username} = useParams();
    console.debug("UserDetails", "username=", username)

    const [bio, setBio] = useState(null)

    useEffect(()=> {
        async function getUser(){
            const userDetails = await PugApi.getCurrentUser(username)
            const {user} = userDetails
            setBio(user)
        }

        getUser()
    }, [username])

    if(!bio) return <LoadingSpinner />

    return (
        <div>
        <h1>User Details: {username}</h1>
        <ul>
          <li>first name: {bio.firstName}</li>
          <li>last name: {bio.lastName}</li>
          <li>city: {bio.city}</li>
          <li>state: {bio.state}</li>
          <li>img: {bio.profileImg}</li>
          <li>email: {bio.email}</li>
          <li>created on: {bio.createdOn}</li>
          <li>phone number: {bio.phoneNumber}</li>
          <li>following: {bio.following}</li>
          <li>followed: {bio.followed}</li>
          <li>is private: {JSON.stringify(bio.isPrivate)}</li>
          <li>is admin: {JSON.stringify(bio.isAdmin)}</li>
        </ul>
      </div>
    )
}

export default UserDetails