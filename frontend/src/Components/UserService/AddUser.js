
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../Api/UserApi";
import toast, { Toaster } from "react-hot-toast";
import AsideBar from "../AsideBar/Asidebar";
const AddUser = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
    //Handle the user creation when click on the add button
  const handleAdd = () => {
    
   
      toast.promise(addUser({firstname, lastname, email, password,phoneNumber }), {
        loading: "Creating...",
        success: <b>User has been Created !</b>,
        error: <b>Could not Create account .</b>,
    });
    
    navigate("/home");
  };
return (
  
  <div> 
<AsideBar/>
    <div>
      <main id="main" class="main">
      <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/home">Accueil</a></li>
      <li class="breadcrumb-item">Créer un utilisateur</li>
      <li class="breadcrumb-item active">Créer nouveau</li>
    </ol>
  </nav>
<div class="card mx-auto w-50">
            <div class="card-body">
              <h5 class="card-title">Créer un nouveau compte</h5>

              <div class="col-12">
              <div class="d-flex justify-content-between">  <label for="yourName" class="form-label"> Nom</label></div>
              <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-person text-primary"></i></span>
                      <input type="text" name="name" class="form-control" id="yourName" required  onChange={(e) => setFirstname(e.target.value)}/>
                      <div class="invalid-feedback">S'il vous plaît, entrez le nom !</div>
                    </div></div>
                    <div class="col-12">
                    <div class="d-flex justify-content-between"><label for="yourUsername" class="form-label">Prénom</label></div>
                    <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-person-fill text-primary"></i></span>
                      <input type="text" name="username" class="form-control" id="yourUsername" required  onChange={(e) => setLastname(e.target.value)}/>
                        <div class="invalid-feedback">S'il vous plaît, entrez le prénom</div>
                    </div></div>
                    <div class="col-12">
                    <div class="d-flex justify-content-between"> <label for="yourEmail" class="form-label"> Email</label></div>
                      <div class="input-group has-validation">
                        <span class="input-group-text text-primary" id="inputGroupPrepend " >@</span>
                      <input type="email" name="email" class="form-control" id="yourEmail" required  onChange={(e) => setEmail(e.target.value)}/>
                      <div class="invalid-feedback"></div>
                      </div>
                    </div>
                    <div class="col-12">
                    <div class="d-flex justify-content-between"> <label for="yourPhoneNumber" class="form-label">Numéro de téléphone</label></div>
                    <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-telephone-fill text-primary" ></i></span>
                      <input type="PhoneNumber" name="PhoneNumber" class="form-control" id="yourPhoneNumber" required onChange={(e) => setphoneNumber(e.target.value)}/>
                      <div class="invalid-feedback">Veuillez saisir numéro de téléphone !</div>
                    </div></div>
                    <div class="col-12">
                    <div class="d-flex justify-content-between"> <label for="yourPassword" class="form-label">Mot de passe</label></div>
                    <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-file-earmark-lock text-primary"></i></span>
                      <input type="password" name="password" class="form-control" id="yourPassword" required onChange={(e) => setPassword(e.target.value)}/>
                      <div class="invalid-feedback">Veuillez saisir votre mot de passe !</div>
                    </div></div>
                
               
                <div class="text-center">
                <br></br>
                  <button type="submit" class="btn btn-primary"  onClick={() => handleAdd()} variant="primary">Valider</button>
          </div></div></div></main></div></div>
   
                
    );
  };
  
 
  
export default AddUser;
