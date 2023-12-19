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
        <h3 style={{ margin: "10px" }}> User List</h3>
        <hr style={{height:"2px"}}/>
        
        <div style={{padding:"10px"}}>
          {Object.entries(userList).map(([userId, user], index) => (
            <div className="UserItem">
              <li style={{ margin: "8px" }} key={index}>
                {index+1} :{user.username}{socket.id==userId?" (You)":""}
              </li>
            </div>
          ))}
        </div>
        {Object.keys(userList).length==1?
          <div style={{height:"50vh" ,display:"flex", alignItems:"center", justifyContent:"center"}}>
            No one here yet
          </div>:""
        }
      </div>
      <button
        className="Toggle-Collapse Users-Button"
        onClick={() => {
          setCollapsed(!collapsed);
          console.log(collapsed);
        }}
      >
        <BsFillPeopleFill className="icon" />
      </button>
    </div>
  );
};

export default ActiveUsers;
