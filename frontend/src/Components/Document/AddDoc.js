import React, { useEffect, useState } from "react";
import AsideBar from "../AsideBar/Asidebar";
import { useNavigate } from "react-router-dom";
import { addDoc } from "../../Api/DocApi";
import toast from "react-hot-toast";
import { getProjectForUser } from "../../Api/ProjectApi";
import { useDispatch } from "react-redux";

const AddDoc = () => {
  const navigate = useNavigate();
  const [titre, settitre] = useState("");
  const [type, settype] = useState("");
  const [projectId,setProjectId]=useState(-1);
  const [projectListe,setProjectListe]=useState(null);
  const [isError,setiSError]=useState(false);
  const [ErroMessage,setErrorMessage]=useState("");
  const dispatch = useDispatch();

  // get data and set it in the store of Users
  const getDataP = async () => {
    try {
      const data = await getProjectForUser();
      dispatch(setProjectListe(data));
    } catch (err) {
      toast.error("Échec du chargement des données");
    }
  };
  //Handle the user creation when click on the add button
  const handleAdd = () => {
    if(projectId==-1){
      setiSError(true);
      setErrorMessage("Le projet est requis ! ");
    }else{

    toast.promise(addDoc({ 
      titre:titre,
      type:type,
      project_id:projectId
      
     }
     ), {
      loading: "Création en cours...",
      success: <b>Le document a été créé !</b>,
      error: <b>Impossible de créer le document.</b>,
      
    }).then((reponse) => {
      let id = reponse.data.id;
      navigate("/ConfigurerModel", { state: { id } });
      //id=>props 

    });
  }
    //
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
              <h5 class="card-titre">Nouveau Document</h5>

              <div class="col-12">
                <div class="d-flex justify-content-between">  <label for="yourName" class="form-label"> Titre</label></div>
                <div class="input-group has-validation">
                  <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-card-heading  text-primary "> </i></span>
                  <input type="text" name="name" class="form-control" id="yourName" required onChange={(e) => settitre(e.target.value)} />
                </div></div>
              <div class="col-12">
                <div class="d-flex justify-content-between"><label for="yourUsername" class="form-label">Type</label></div>
                <div class="input-group has-validation">
  <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-file-earmark-zip text-primary"> </i></span>
  <select name="documentType" class="form-select" id="documentType" required onChange={(e) => settype(e.target.value)}>
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
</div></div>
             
              {projectListe!=null?(
                <div class="col-12">
                <div class="d-flex justify-content-between"> <label for="yourEmail" class="form-label"> Projet</label></div>
                <div class="input-group has-validation">
                  <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-stack text-primary "> </i></span>
                  <select class="form-select" name="project_id"  onChange={(e) => setProjectId( Number(e.target.value) )} >
                    <option value={-1}>Selectionnez un projet</option>
                    {projectListe.map((p,ke)=>
                      <option value={p.id} >{p.Title}</option>
                      )

                    }
                  
                   
                  </select>
                </div>
                
              </div>
              ):(
                isError&&
                <div className="alert alert-light my-3">
                    {ErroMessage}

                </div>
                
              )}
              
              
              <div class="text-center">
                <br></br>
                {isError&&projectListe&&
 <div className="alert alert-light my-3">
                    {ErroMessage}

                </div>
                

                }
                </div>
             
              <div class="text-center">
                <br></br>
                <button type="submit" class="btn btn-primary" onClick={() => handleAdd()} variant="primary">Sauvgarder</button>
              </div></div>
              </div>
              </main></div></div>


  );
};



export default AddDoc;
