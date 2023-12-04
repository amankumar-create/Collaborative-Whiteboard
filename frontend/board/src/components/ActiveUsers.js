import React, { useEffect, useState } from "react";

const ActiveUsers = ({ socket }) => {
  const [userList, setUserList] = useState({});

  useEffect(() => {
    socket.on("updateUserList", (payload) => {
      setUserList(payload.activeUsers);
    });
  }, []);

  return (
    <div className="ActiveUsers">
      <h3>User List</h3>

       
        {Object.entries(userList).map(([userId, user], index) => (
          <div className="UserItem">
            <li style={{ margin: "8px" }} key={index}>{index} :{user.username}</li>
          </div>
        ))}
      
    </div>
  );
};

export default ActiveUsers;
