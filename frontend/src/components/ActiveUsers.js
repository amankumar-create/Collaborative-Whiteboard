import React, { useEffect, useState } from "react";
import { BsFillPeopleFill } from "react-icons/bs";

const ActiveUsers = ({ socket }) => {
  const [userList, setUserList] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    socket.on("updateUserList", (payload) => {
      setUserList(payload.activeUsers);
    });
  }, []);

  return (
    <div>
      <div className={`ActiveUsers ${collapsed ? "collapsed" : ""}`}>
        <h3>User List</h3>
        {Object.entries(userList).map(([userId, user], index) => (
          <div className="UserItem">
            <li style={{ margin: "8px" }} key={index}>
              {index} :{user.username}
            </li>
          </div>
        ))}
      </div>
      <button
        className="Toggle-Collapse Users-Button"
        style={{ position: "fixed", bottom: "12px", left: "15px", width:'40px', height:'40px', background:'white', borderRadius:'20px'}}
        onClick={() => {
          setCollapsed(!collapsed);
          console.log(collapsed);
        }}
      >
        <BsFillPeopleFill className="icon"/>
      </button>
    </div>
  );
};

export default ActiveUsers;
