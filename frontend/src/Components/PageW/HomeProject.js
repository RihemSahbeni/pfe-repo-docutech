import React from 'react'
import ProjectTable from '../ProjectService/ProjectTable';
import AsideBar from '../AsideBar/Asidebar';
const HomeProject = () => {
  

  return (
    <div> 
      <AsideBar />
      <div>
      <main id="main" class="main">
      
      <div >
      
            <br/>
              <ProjectTable/>
            </div></main>
        
      </div>
    </div>
  );
  

};

export default HomeProject;
