import React, { useEffect, useState } from "react";
import AsideBar from "../AsideBar/Asidebar";
import { useNavigate } from "react-router-dom";
import { addDoc } from "../../Api/DocApi";
import toast from "react-hot-toast";
import { getProjectForUser } from "../../Api/ProjectApi";
import { useDispatch, useSelector } from "react-redux";
import { setProject } from "../../store/ProjectSlice";

const AddModel = () => {
  const navigate = useNavigate();
  const [Titre, setTitre] = useState("");
  const [Type, setType] = useState("");

  const Docs = useSelector((state) => state.Doc);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();


  // get data and set it in the store of Users
  const getDataP = async () => {
    try {
      const data = await getProjectForUser();
      dispatch(setProject(data));
      setisLoading(true);
    } catch (err) {
      setError(err.message);
      setisLoading(false);
      toast.error("Failed to load data");
    }
  };
  //Handle the  creation when click on the add button
  const handleAdd = () => {
toast.promise(addDoc({ "titre":Titre, "type":Type }), {
      loading: "Création en cours...",
      success: <b>Le document a été créé !</b>,
      error: <b>Impossible de créer le document.</b>,      
    }).then((reponse) => {
      let id = reponse.data.id;
      navigate("/ConfigurerModel", { state: { id } });
      //id=>props 

    });

  };
  //Call get data function
  useEffect(() => {
 getDataP();
  }, []);

  return (

    <div>
      <AsideBar />
      <div>
        <main id="main" class="main">
          <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/home">Acceuil</a></li>
              <li class="breadcrumb-item">Modéle</li>
              <li class="breadcrumb-item active">Nouveau</li>
            </ol>
          </nav>
          <div class="card mx-auto w-50">
            <div class="card-body">
              <h5 class="card-titre">Nouveau Modéle</h5>

              <div class="col-12">
                <div class="d-flex justify-content-between">  <label for="yourName" class="form-label"> Titre</label></div>
                <div class="input-group has-validation">
                  <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-card-heading  text-primary "> </i></span>
                  <input type="text" name="name" class="form-control" id="yourName" required onChange={(e) => setTitre(e.target.value)} />
                </div></div>
              <div class="col-12">
              <div class="d-flex justify-content-between">
  <label for="documentType" class="form-label">Type de document</label>
</div>
<div class="input-group has-validation">
  <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-file-earmark-zip text-primary"> </i></span>
  <select name="documentType" class="form-select" id="documentType" required onChange={(e) => setType(e.target.value)}>
    <option value="">Sélectionner un type de document</option>
    <option value="Manuels d'utilisation">Manuels d'utilisation</option>
    <option value="Guides de référence">Guides de référence</option>
    <option value="Spécifications techniques">Spécifications techniques</option>
    <option value="Schémas et plans">Schémas et plans</option>
    <option value="Procédures opérationnelles standard (SOP)">Procédures opérationnelles standard (SOP)</option>
    <option value="Rapports techniques">Rapports techniques</option>
    <option value="Cahiers des charges">Cahiers des charges</option>
    <option value="Fiches techniques">Fiches techniques</option>
  </select>
</div>
</div>
              
              <div class="text-center">
                <br></br>
                <button type="submit" class="btn btn-primary" onClick={() => handleAdd()} variant="primary">Sauvgarder</button>
              </div></div>
              </div>
              </main></div></div>


  );
};



export default AddModel;
