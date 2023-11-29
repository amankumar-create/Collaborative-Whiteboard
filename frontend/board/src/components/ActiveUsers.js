import React, { useEffect, useState } from 'react';
 

const ActiveUsers = ({socket}) => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
         
        socket.on('updateUserList', (users) => {

            setUserList(users);
        });

        
    }, []);

    return (
        <div>
            <h2>Active Users in the Room:</h2>
            <ul>
                {userList.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
            {/* Your chat UI components here */}
        </div>
    );
};

export default ActiveUsers;
