import React, { useEffect, useState } from "react";
import { getDoc,getDocById,deleteDoc} from "../../Api/DocApi";
import { useDispatch} from "react-redux";
import { setDoc } from "../../store/DocSlice";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import { Loader } from "rsuite";
import Button from "@mui/material/Button";
import { Modal } from 'react-bootstrap';
import Avatar from 'react-avatar';
import CloneDoc from "./CloneDoc";
import AsideBar from "../AsideBar/Asidebar";


const DocsParProject = () => {
    const location = useLocation();

    const idProject = location.state?.id;

 //Call hooks
 const dispatch = useDispatch();
 const navigate = useNavigate();

 //const Docs = useSelector((state) => state.Doc);
 const [isLoading, setisLoading] = useState(false);
 const [DocDetails, setDocDetails] = useState(null);
 const [open, setOpen] = useState(false);
 const [Opendelete, setOpendelete] = useState(false);
 const [Docs, setdocstate] = useState([]);
 const [DocsFromBase,setDocsFromBase]=useState([]);

 const [openCloneDoc, setOpenCloneDoc] = useState(false);
 const [cloneModel, setClonedModel] = useState(null);
 const [openConfirme, setOpenConfirme] = useState(false);

 const handleCloseConfirme = () => {
  setDocDetails(null);
  setOpenConfirme(false);
};
const handleViewConfirme = (doc) => {
  setClonedModel(doc);
  setOpenCloneDoc(true);
};
const hideClone = () => {
  setOpenCloneDoc(false);
  setClonedModel(null);
}


const getData = async () => {
    console.log("project id ",idProject)
  let data = await getDoc();
  console.log(data);
  data=data.filter((d)=>d.project_id===idProject);
  dispatch(setDoc(data));
  setDocsFromBase(data);
  setdocstate(data);
  setisLoading(!isLoading);
  console.log(isLoading);
};
 //afficher les details 
 const getDocDetails = async (docId) => {
  try {
    const data = await getDocById(docId);
// utilisez l'API pour obtenir les détails de l'utilisateur
    setDocDetails(data); // mettre à jour l'état des détails de l'utilisateur
  } catch (err) {
    console.error(err);
  }
};
  //ouvrir et fermer le modal du update project 
  const handleClose = () => {
    setDocDetails(null);
    setOpen(false);
  };
  const handleViewdetail = (docId) => {
    getDocDetails(docId); // appel de la méthode pour obtenir les détails de l'utilisateur
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(id);
      toast.success("Document supprimé !");
      window.location.reload(); // Recharger la page après la suppression
    } catch (error) {
      toast.error("Impossible de supprimer le document.");
    }
  };
  
  const handleViewdelete = (projectId) => {
    getDocDetails(projectId); // appel de la méthode pour obtenir les détails de l'utilisateur
    setOpendelete(true);
  };
  
  const handleClosedelete = () => {
    setDocDetails(null);
    setOpendelete(false);
    };
    const handleSearch=(event)=>{
      const {value}=event.target
        let docs=DocsFromBase;
          docs=    docs.filter((d)=>d.type.includes(value)||d.titre.includes(value));
       
        setdocstate(docs);
    
    }
 //Call get data function
 useEffect(() => {
   getData();
 
 }, []);


 return (
  <>
  <div> 
<AsideBar/>
    <div>
      <main id="main" class="main">
      
<div >
      <br/>
  {!openCloneDoc&&
   <div>
     <div class="pagetitle">
     <nav>
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="">Accueil</a></li>
    <li class="breadcrumb-item">Document</li>
    <li class="breadcrumb-item active">Liste</li>
  </ol>
</nav>
<h1 class="text-center">Documents du projet</h1>

<nav class="d-flex my-3">
  <input
    type="text"
    name="search"
    onChange={handleSearch}
    className="form form-control"
  />
</nav>

 </div>
 {/* Section get all Doc */}
<div className="row row-cols-1 row-cols-md-3 g-4">
  {Docs&& Docs.map(Doc => (
    <div className="col" key={Doc.id}>
     <div className="card mb-0" style={{ height: "300px" }}>
        <div class="row g-0">
          <div class="col-md-10">
            <Card.Body>
              <div class="d-flex justify-content-center align-items-center mb-2">
                <Avatar
                  name={Doc.titre}
                  size="50"
                  round={true}
                  className="me-3"
                  style={{ backgroundColor: "#1976d2" }}
                />
                <Card.Title>
                  <h4>{Doc.titre}</h4>
                </Card.Title>
              </div>
              <div class="col-md-20">
                <div class="card-text">
                  <div class=" justify-content-between text-Dark">
                    <Card.Text>
                      <i class="bi bi-card-text text-Dark"> Type : </i>{" "}
                      {Doc.type}
                    </Card.Text>
                  </div>
                  <div class=" justify-content-between text-Dark">
                  <Card.Text>
  <i class="bi bi-calendar3 text-Dark"> Date de creation : </i>{" "}
  {new Date(Doc.created_at).toLocaleDateString()}
</Card.Text>
            </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer><div class="col-md-20 d-flex justify-content-center">
  <button
    type="button"
    class="btn btn-light rounded-pill mx-1"
    onClick={() => handleViewdetail(Doc.id)}
  >
    <i class="bi bi-eye"></i>
  </button>
  <button
                      type="button"
                      className="btn btn-light rounded-pill mx-1"
                      onClick={() => {
                        let id = Doc.id; navigate("/ConfigurerModel", { state: { id } })
                      }}
                    >
                   <i class="bi bi-pencil-square"></i>
                    </button>
  <button
                          type="button"
                          class="btn btn-light rounded-pill mx-1"
                          onClick={() => handleViewConfirme(Doc)}
                        >
                          <i class="bi bi-files"></i>
                        </button>
  <button
    type="button"
    class="btn btn-light rounded-pill mx-1"
    onClick={() => handleViewdelete(Doc.id)}
  >
    <i class="bi bi-trash"></i>
  </button>
</div>
</Card.Footer>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
 {/* section Détails   */}
<Modal show={open} onHide={handleClose} dialogClassName="my-modal">
  <Modal.Header closeButton>
    <h5 class="modal-title">Détails du Document</h5>
  </Modal.Header>
  <Modal.Body>
    {DocDetails ? (
      <div>
        <div class="row">
          <div class="col-md-12">
            <div class="d-flex justify-content-center align-items-center mb-2">
             
              <Card.Title>
                <h4>{DocDetails.titre}</h4>
              </Card.Title>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <form class="row g-3">
              <div className=" label text-dark">
                <i class=" bi-file-earmark-text" /> type : {DocDetails.type}
              </div>
             <div className=" label text-dark">
                <i class="bi bi-calendar2-date" />Description : Ce document est crée le  {new Date(DocDetails.created_at).toLocaleDateString()} par {DocDetails.created_by}
             </div>
             <div className="label text-dark">
  <i className="bi bi-journal-text"></i> Le projet de ce document est <span className="project-name" style={{ color: 'blue' }}>{DocDetails.project.name}</span>
</div>

              
               </form>
          </div>
        </div>
      </div>
    ) : (
      <Loader />
    )}
  </Modal.Body>
  <Modal.Footer>
  
    <Button variant="secondary" onClick={handleClose}>
      Fermer
    </Button>
  </Modal.Footer>
</Modal>
  {/* section delete  */}

  <Modal show={Opendelete} onHide={handleClosedelete} closeButton>
  <Modal.Body>
    {DocDetails ? (
      <div>
      <h5 class="text-center text-dark">
        <i class="bi bi-exclamation-octagon me-1 text-danger"></i>
        Voulez-vous vraiment supprimer ce document <i class="text-danger">{DocDetails.Name}?</i>
      </h5>
        <div class="row">
          <div class="col mb-5">
            <div class="row g-3">
              <div class="col mb-0 text-center">
                <br></br>
                <button type="button" class="btn btn-danger rounded-pill me-4 " onClick={() => {handleDelete(DocDetails.id);handleClosedelete();}}>Oui</button>
                <Button type="button" class="btn btn-secondary rounded-pill" onClick={handleClosedelete}>Non</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Loader />
    )}
  </Modal.Body>
</Modal>
   </div>
    }
   {openCloneDoc && cloneModel &&
    <CloneDoc sourceModel={cloneModel} notifParentToHide={hideClone}
    multipleProject={false}
    />
  }
        </div></main></div></div>

 </>
 
 );
};


export default DocsParProject;