import React, { useState} from 'react';
import { useLocation,useNavigate } from "react-router-dom";
const AsideBar = () => {
      const navigate = useNavigate();
      const location = useLocation();
    const [selectedPage,setSelectedPage]=useState(1);
    const userRole = localStorage.getItem('userRole');
 function goBack(){
      navigate(-1);
    }

    return (
      <div>
<aside id="sidebar" class="sidebar">

<ul class="sidebar-nav" id="sidebar-nav">
{selectedPage==1?(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(1) }><a class="nav-link collapsed" href="/dashboard">
        <i class="bi bi-grid"></i>
        <span>Tableau de bord</span>
      </a></li>

):(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(1) }><a class="nav-link collapsed" href="/dashboard">
        <i class="bi bi-grid"></i>
        <span>Tableau de bord</span>
      </a></li>

)}

{userRole === "Admin" && selectedPage === 6 ? (
  <li class="nav-item active" onClick={(e) => setSelectedPage(6)}>
    <a class="nav-link collapsed" href="/home">
      <i class="bi bi-people"></i><span>Liste des utilisateurs</span>
    </a>
  </li>
) : (
  userRole === "Admin" && (
    <li class="nav-item active" onClick={(e) => setSelectedPage(6)}>
      <a class="nav-link collapsed" href="/home">
        <i class="bi bi-people"></i><span>Liste des utilisateurs</span>
      </a>
    </li>
  )
)}
 {userRole === "Admin"  && selectedPage==2?(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(2) }><a class="nav-link collapsed" href="/homeProject">
<i class="bi bi-layout-text-window-reverse"></i>
        <span>Liste des projets</span>
      </a></li>

):(
      userRole === "Admin" && (
<li class="nav-item active"  onClick={(e)=>setSelectedPage(2) }><a class="nav-link collapsed" href="/homeProject">
<i class="bi bi-layout-text-window-reverse"></i>
        <span>Liste des projets</span>
      </a></li>)

)}

{userRole === "Utilisateur"  && selectedPage==7?(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(7) }><a class="nav-link collapsed" href="/homeMyProject">
<i class="bi bi-archive"></i>
        <span>Mes projets</span>
      </a></li>

):(
      userRole === "Utilisateur"  &&(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(7) }><a class="nav-link collapsed" href="/homeMyProject">
<i class="bi bi-archive"></i>
        <span>Mes projets</span>
      </a></li>)

)}

  {userRole === "Admin"  && selectedPage==4?(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(4) }><a class="nav-link collapsed" href="/homeDoc">
<i class="bi bi-journal-text"></i><span>Liste des document</span>
      </a></li>

):(
      userRole === "Admin" && (
<li class="nav-item active"  onClick={(e)=>setSelectedPage(4) }><a class="nav-link collapsed" href="/homeDoc">
<i class="bi bi-journal-text"></i><span>Liste des document</span>
      </a></li>)

)}  

{userRole === "Utilisateur"  && selectedPage==8?(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(8) }><a class="nav-link collapsed" href="/MyDocHome">
<i class="bi bi-journal-check"></i><span>Mes document</span>
      </a></li>

):(
      userRole === "Utilisateur" && (
<li class="nav-item active"  onClick={(e)=>setSelectedPage(8) }><a class="nav-link collapsed" href="/MyDocHome">
<i class="bi bi-journal-check"></i><span>Mes document</span>
      </a></li>)

)} 



{selectedPage==5?(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(5) }><a class="nav-link collapsed" href="/ModelHome">
<i class="bi bi-journals"></i><span>Les modéles </span>
      </a></li>

):(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(5) }><a class="nav-link collapsed" href="/ModelHome">
<i class="bi bi-journals"></i><span>Les modéles</span>
      </a></li>

)}


{selectedPage==3?(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(3) }><a class="nav-link collapsed" href="/history">
<i class="bi bi-hourglass"></i><span>Historique </span>
      </a></li>

):(
<li class="nav-item active"  onClick={(e)=>setSelectedPage(3) }><a class="nav-link collapsed" href="/history">
<i class="bi bi-hourglass"></i><span>Historique</span>
      </a></li>

)}  
</ul>
<ul className="nav">
        {location.pathname === "/DocsParProjet" && (
          <li className="nav-item">
            <a onClick={goBack} className="nav-link collapsed">
              <i className="bi bi-arrow-left"></i> Retour
            </a>
          </li>
        )}
       
      </ul>
      <ul className="nav">
        {location.pathname === "/createproject" && (
          <li className="nav-item">
            <a onClick={goBack} className="nav-link collapsed">
              <i className="bi bi-arrow-left"></i> Retour
            </a>
          </li>
        )}
       
      </ul>
  </aside>


      </div>  
    )
  

};

export default AsideBar;

