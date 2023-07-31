import React, { useEffect, useState } from "react";
import { getMyDoc,getDocById,deleteDoc} from "../../Api/DocApi";
import { useDispatch, useSelector } from "react-redux";
import { setDoc } from "../../store/DocSlice";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import { Loader } from "rsuite";
import Button from "@mui/material/Button";
import { Modal } from 'react-bootstrap';
import Avatar from 'react-avatar';
import CloneDoc from "./CloneDoc";
import { Hypnosis} from "react-cssfx-loading"

const TableMyDoc = () => {
 //Call hooks
 const dispatch = useDispatch();
 const navigate = useNavigate();
 //Call Doc state from store

 //const Docs = useSelector((state) => state.Doc);
 const [isLoading, setisLoading] = useState(false);
 const [DocDetails, setDocDetails] = useState(null);
 const [open, setOpen] = useState(false);
 const [Opendelete, setOpendelete] = useState(false);
 const [Docs, setdocstate] = useState([]);
 const [openCloneDoc, setOpenCloneDoc] = useState(false);
 const [cloneModel, setClonedModel] = useState(null);
 const [openConfirme, setOpenConfirme] = useState(false);
 const [docsFromBase,setDocsFromBase]=useState([])
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


//get data and set it in the store of Docs

const getData = async () => {
  const data = await getMyDoc();
  console.log(data);
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

  const handleDelete = (id) => {
    // Suppression du document
    deleteDoc(id)
      .then(() => {
        // Succès de la suppression, rechargement de la page
        window.location.reload();
      })
      .catch((error) => {
        // Gérer les erreurs lors de la suppression du document
        console.error("Erreur lors de la suppression du document :", error);
      });
  };
  
  const handleViewdelete = (projectId) => {
    getDocDetails(projectId); // appel de la méthode pour obtenir les détails de l'utilisateur
    setOpendelete(true);
  };
  
  const handleClosedelete = () => {
    setDocDetails(null);
    setOpendelete(false);
    };
 //Call get data function
 useEffect(() => {
   getData();
 
 }, []);
 
const handleSearch=(event)=>{
  const {value}=event.target
    let docs=docsFromBase;
      docs=    docs.filter((d)=>d.type.includes(value)||d.titre.includes(value));
    setdocstate(docs);

}

 //pagination  const [currentPage, setCurrentPage] = useState(1);
 const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = Docs.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(Docs.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
 return (
  <>
  {!openCloneDoc&&
   <div>
       <div class="pagetitle">


       <nav>
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="">Acceuil</a></li>
    <li class="breadcrumb-item">Mes Documents</li>
    <li class="breadcrumb-item active">Liste</li>
  </ol>
</nav>
<h1 className="text-center">Liste de mes documents </h1>

<nav class="d-flex mb-3">




  <button type="button" class="btn btn-light rounded-pill ms-auto p-2 ">
    <a href="/createdoc"><h1><i class="bi bi-file-earmark-plus"></i></h1></a></button>

</nav>

</div>
   

    <div className="row row-cols-1 my-4">
          <input
          type="text"
          name="search"
          onChange={handleSearch}
          className="form form-control"
          />
    </div>
<div className="row row-cols-1 row-cols-md-3 g-4">
  {currentDocs&& currentDocs.map(Doc => (
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
              <div class=" justify-content-between text-Dark">
                  <Card.Text>
  <i class="bi bi-folder"></i>{" "}
 {Doc.project_data.Title}
</Card.Text>
            </div>
              <div class="col-md-20">
                <div class="card-text">
                  <div class=" justify-content-between text-Dark">
                    <Card.Text>
                      <i class="bi bi-card-text text-Dark"> </i>{" "}
                      {Doc.type}
                    </Card.Text>
                  </div>
                  
                  <div class=" justify-content-between text-Dark">
                  <Card.Text>
  <i class="bi bi-calendar3 text-Dark"></i>{" "}
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
     <ul className="pagination">
      {pageNumbers.map((pageNumber) => (
        <li key={pageNumber} className="page-item">
          <a
            onClick={() => paginate(pageNumber)}
            href="#"
            className="page-link"
          >
            {pageNumber}
          </a>
        </li>
      ))}
    </ul>
</div>  

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
  <Button variant="primary" class="btn btn-info"onClick={()=>{
      let id=DocDetails.id ;navigate("/ConfigurerModel",{ state: { id }})}} > Aller </Button>
    <Button variant="secondary" onClick={handleClose}>
      Fermer
    </Button>
  </Modal.Footer>
</Modal>
  {/* section delete project */}

  <Modal show={Opendelete} onHide={handleClosedelete} closeButton>
  <Modal.Body>
    {DocDetails ? (
      <div>
        <h5 className="text-center text-dark">
          <i className="bi bi-exclamation-octagon me-1 text-danger"></i>
          Voulez-vous vraiment supprimer ce document{" "}
          <i className="text-danger">{DocDetails.Name}?</i>
        </h5>
        <div className="row">
          <div className="col mb-5">
            <div className="row g-3">
              <div className="col mb-0 text-center">
                <br />
                <button
                  type="button"
                  className="btn btn-danger rounded-pill m-2"
                  onClick={() => {
                    handleDelete(DocDetails.id);
                    handleClosedelete();
                  }}
                >
                  Oui
                </button>
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill m-2"
                  onClick={handleClosedelete}
                >
                  Non
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="col-6 mx-auto mt-5">
    <Hypnosis color="#a6cee3" width="100px" height="100px" duration="3s" />
  </div>
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
 </>
 );
};


export default TableMyDoc;