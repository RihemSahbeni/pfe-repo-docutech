import React from 'react'
import HistoryTable from '../HistoryService/HistoryTable'
import AsideBar from '../AsideBar/Asidebar';
const History = () => {
 

  return (
    <div>
      <AsideBar />

      <main id="main" className="main">
        

        <section className="section-dashboard ">
          <HistoryTable/>
          </section>
          </main>
          </div>
      
    )

};

export default History;
