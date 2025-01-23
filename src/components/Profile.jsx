import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user);
  return user &&  (
    <div className="h-screen bg-gradient-to-b from-black to-gray-800">
      <EditProfile user={user} />
    </div>
  );
};

export default Profile;
