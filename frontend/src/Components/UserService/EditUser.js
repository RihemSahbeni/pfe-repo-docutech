
import { getUserById ,editUsers} from "../../Api/UserApi";
import toast from "react-hot-toast";
import  { useState, useEffect } from 'react';

const EditUser = () => {
   const [user, setUser] = useState(null);
   const [firstname, setFirstname] = useState("");
   const [lastname, setLastname] = useState("");
   const [email, setEmail] = useState("");
   const [phoneNumber, setphoneNumber] = useState("");
  // Récupérez l'id stocké dans le localStorage
    const id = localStorage.getItem('id');
   useEffect(() => {
      // Si l'id existe, récupérez l'utilisateur correspondant
     if (id) {
       getUserById(id)
         .then(data => setUser(data))
         .catch(error => console.log(error));
     }
   }, []);
  //Handle the user creation when click on the add button
  const handleEditUser = (user) => {
    
    toast.promise(editUsers(id,user), {
      loading: "Editing...",
      success: <b>User Edited!</b>,
      error: <b>Could not Edit User.</b>,
    }); };

  return (
    
<div class="tab-content pt-2">
<div class="tab-pane fade show active profile-overview" id="profile-overview">
  <h5 class="card-title"></h5> 
            {user ? (
              <div>
                   <form>
         

              <div class="row mb-3">
                <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Nom</label>
                <div class="col">
                  <input name="fullName" type="text" class="form-control" id="fullName" defaultValue={user.firstname}   onChange={(e) => setFirstname(e.target.value)}/>
                </div>
              </div>
              
              
              <div class="row mb-3">
                      <label for="Address" class="col-md-4 col-lg-3 col-form-label">Prénom</label>
                      <div class="col">
                        <input name="address" type="text" class="form-control" id="Prénom" defaultValue={user.firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="Phone" class="col-md-4 col-lg-3 col-form-label">Téléphone</label>
                      <div class="col">
                        <input name="phone" type="text" class="form-control" id="Phone"onChange={(e) => setphoneNumber(e.target.value)}
            
                defaultValue={user.phoneNumber }/>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="Email" class="col-md-4 col-lg-3 col-form-label">Email</label>
                      <div class="col">
                        <input name="email" type="email" class="form-control" id="Email"  onChange={(e) => setEmail(e.target.value)}
              
                defaultValue={user.email}/>
                      </div>
                    </div>

           
                <div class="col-12">
                  <button class="btn btn-primary" onClick={() => {handleEditUser({ firstname,lastname,email,phoneNumber })}}>Sauvegarder </button>
                </div>
              </form>
                
              </div>
             
            ) : (
              <h1></h1>
            )}
       </div></div>
    )

};

export default EditUser;
