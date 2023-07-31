
import { getUserById } from "../../Api/UserApi";
import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import EditUser from "./EditUser";
import ModifierPassword from "../Authetification/ModifierPassword";
import { Hypnosis} from "react-cssfx-loading"
import AsideBar from "../AsideBar/Asidebar";
const Profile = () => {
   const [user, setUser] = useState(null);
   const [selectedPage,setSelectedPage]=useState(1);
   useEffect(() => {
     // Récupérez l'idstocké dans le localStorage
     const id = localStorage.getItem('id');
     // Si l'email existe, récupérez l'utilisateur correspondant
     if (id) {
       getUserById(id)
         .then(data => setUser(data))
         .catch(error => console.log(error));
     }
   }, []);

  return (
    <div>
    <div className="App">
    
        <div>
        <AsideBar/>
          <main id="main" class="main">
  
  <div class="pagetitle">
    <h1>Profile</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/home">Accueil</a></li>
        <li class="breadcrumb-item">Utilisateur</li>
        <li class="breadcrumb-item active">Profile</li>
      </ol>
    </nav>
  </div>
  
          {user ? (
            <section class="section profile">
            <div class="row">
              <div class="col-xl-4">
<div className="card">
<div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
    <Avatar name={`${user.firstname} ${user.lastname}`} size="100" round={true} className="mb-3"/>
    <h4 className="text-secondary">{user.firstname} {user.lastname} </h4>
  </div>
  </div>
  </div>
  
  <div class="col-xl-8">

    <div class="card">
      <div class="card-body pt-3">
      <ul class="nav nav-tabs nav-tabs-bordered">

<li class="nav-item">
{selectedPage==1?(
<button class="nav-link active"  onClick={(e)=>setSelectedPage(1) }>Aperçu</button>

):(
<button class="nav-link "  onClick={(e)=>setSelectedPage(1) }>Aperçu</button>

)}
</li>

<li class="nav-item">
{selectedPage==2?(
<button  class="nav-link active" onClick={(e)=>setSelectedPage(2)} >Modifier le profil</button>

):(
<button  class="nav-link " onClick={(e)=>setSelectedPage(2)} >Modifier le profil</button>

)}
</li>
{/*<li class="nav-item">
<a href="/CodeverifUser"class="nav-link" >Verification Link</a>
</li>*/}
<li class="nav-item">
{selectedPage==3?(
<button  class="nav-link active"  onClick={(e)=>setSelectedPage(3)} >Changer mot de passe</button>

):(
<button  class="nav-link "  onClick={(e)=>setSelectedPage(3)} >Changer mot de passe</button>

)}
</li>

</ul>
{selectedPage==1&&
<div class="tab-content pt-2">
<div class="tab-pane fade show active profile-overview" id="profile-overview">
<h5 class="card-title"></h5> 
    {user ? (
      
      <div>
     
        <h5 className="card-title">Informations de mon profil</h5>
        <br></br>
        <div className="row">
          <div className="col-lg-3 col-md-4 label"><i class="bi bi-person">  </i>Nom</div>
          <div className="col-lg-3 col-md-4">{user.firstname}</div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-lg-3 col-md-4 label"><i class="bi bi-person-fill">  </i>Prénom</div>
          <div className="col-lg-3 col-md-4">{user.lastname}</div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-lg-3 col-md-4 label"><i class="bi bi-at">  </i>Email</div>
          <div className="col-lg-4 col-md-5">{user.email}</div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-lg-3 col-md-4 label"><i class="bi bi-telephone-fill">  </i>Téléphone</div>
          <div className="col-lg-3 col-md-4">{user.phoneNumber}</div>
      </div>
      </div>
    ) : (
      <h1></h1>
    )}
</div></div>
}
{selectedPage==2&&
<EditUser />
}
{selectedPage==3&&
<ModifierPassword/>
}
</div></div></div></div>
</section>
 ) : (
  <div className="row">
  <div className="col-3 mx-auto">
  <Hypnosis color="#a6cee3
  " width="100px"  height="100px" duration="3s" />
  </div>
</div>

)}
  
          </main></div></div>
</div>
   
    )

};

export default Profile;
