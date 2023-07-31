import React from 'react'
import UserTable from '../UserService/UserTable'
import AsideBar from '../AsideBar/Asidebar';
const Home = () => {
 

  return (
    <div> 
<AsideBar/>
    <div>
      <main id="main" class="main">
      
<div >
      <br/>
        <UserTable/>
      </div></main></div></div>
      
    )

};

export default Home;
