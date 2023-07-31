import React, { useEffect, useState } from "react";
import { getDoc,getDocById,deleteDoc} from "../../Api/DocApi";
import { useDispatch} from "react-redux";
import { setDoc } from "../../store/DocSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Card, Pagination } from "react-bootstrap";
import { Loader } from "rsuite";
import Button from "@mui/material/Button";
import { Modal } from 'react-bootstrap';
import Avatar from 'react-avatar';
import CloneDoc from "./CloneDoc";


const TableDoc = () => {
 //Call hooks
 const dispatch = useDispatch();
 const navigate = useNavigate();
 //filter
 const [filter,setFilter]=useState("all");
 //delete
 const [Opendelete, setOpendelete] = useState(false);
 //data
 const [isLoading, setisLoading] = useState(false);
 const [DocDetails, setDocDetails] = useState(null);
 const [open, setOpen] = useState(false);
 const [Docs, setdocstate] = useState([]);
 const [DocsFromBase,setDocsFromBase]=useState([]);
//clone
 const [openCloneDoc, setOpenCloneDoc] = useState(false);
 const [cloneModel, setClonedModel] = useState(null);
 const [openConfirme, setOpenConfirme] = useState(false);

  //pagination  
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

 /* info doc */
const getData = async () => {
  const data = await getDoc();
  console.log(data);
  dispatch(setDoc(data));
  setDocsFromBase(data);
  setdocstate(data);
  setisLoading(!isLoading);
  console.log(isLoading);
};

 const getDocDetails = async (docId) => {
  try {
    const data = await getDocById(docId);
setDocDetails(data); 
  } catch (err) {
    console.error(err);
  }
};
 
  const handleClose = () => {
    setDocDetails(null);
    setOpen(false);
  };
  const handleViewdetail = (docId) => {
    getDocDetails(docId); 
    setOpen(true);
  };
  useEffect(() => {
    getData();
  
  }, []);
  
/*clone doc*/
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


/*delete*/
  const handleDelete = async (id) => {
    try {
      await deleteDoc(id);
      toast.success("Document supprimé avec succès !");
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
    /*filter*/
    const handleSearch=(event)=>{
      const {value}=event.target
        let docs=DocsFromBase;
        if(filter=="all"){
          docs=    docs.filter((d)=>d.type.includes(value)||d.titre.includes(value));
        }else{
          const firstname = localStorage.getItem("firstname");
           const lastname = localStorage.getItem("lastname");
         docs=    docs.filter((d)=> d.created_by === `${firstname} ${lastname}`).filter((d)=>d.type.includes(value)||d.titre.includes(value));

        } 
        setdocstate(docs);
    
    }
    function changeDisplay() {
      if (filter === "all") {
        getData();
      } else {
        let newdata = Docs;
        const firstname = localStorage.getItem("firstname");
        const lastname = localStorage.getItem("lastname");
        newdata = newdata.filter((d) => d.created_by === `${firstname} ${lastname}`);
    
        setdocstate(newdata);
      }
    }
    useEffect(()=>{
      changeDisplay();
     },[filter])


 return (
  <>
  {!openCloneDoc&&
   <div>
     <div class="pagetitle">
     <nav>
  <ol className="breadcrumb">
    <li className="breadcrumb-item"><a href="">Accueil</a></li>
    <li className="breadcrumb-item">Document</li>
    <li className="breadcrumb-item active">Liste</li>
  </ol>
</nav>
<h1 className="text-center">Liste des documents</h1>
  
   <nav class="d-flex mb-3">
    {filter==="all"?(
      <>
            <button type="button" className="btn btn-primary rounded-pll p-2   me-2" onClick={()=>setFilter("all")}>Tous</button>

      <button type="button" className="btn btn-light rounded-pll p-2" onClick={()=>setFilter("mine")}>Mes Documents</button>
      </>

    ):(
      <>
      <button type="button" className="btn btn-light rounded-pll p-2   me-2" onClick={()=>setFilter("all")}>Tous</button>

      <button type="button" className="btn btn-primary rounded-pll p-2" onClick={()=>setFilter("mine")}>Mes Documents</button>
      </>
    )}
   

   <button type="button" class="btn btn-light rounded-pill ms-auto p-2 ">
    <a href="/createdoc"><h1><i class="bi bi-file-earmark-plus"></i></h1></a></button>
 
    </nav>
    <nav class="d-flex my-3">
    <input
          type="text"
          name="search"
          onChange={handleSearch}
          className="form form-control"
          />
    </nav>
 </div>
 <div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
      {currentDocs&&currentDocs.map(Doc => (
            <div className="col" key={Doc.id}>
              <div className="card mb-0" style={{ height: "300px" }}>
                <div className="row g-0">
                  <div className="col-md-10">
                    <Card.Body>
                      <div className="d-flex justify-content-center align-items-center mb-2">
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
                      <div className="col-md-20">
                        <div className="card-text">
                          <div className="justify-content-between text-Dark">
                            <Card.Text>
                              <i className="bi bi-card-text text-Dark"></i>{" "}
                              {Doc.type}
                            </Card.Text>
                          </div>
                          <div className="justify-content-between text-Dark">
                            <Card.Text>
                              <i className="bi bi-calendar3 text-Dark"></i>{" "}
                              {new Date(Doc.created_at).toLocaleDateString()}
                            </Card.Text>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <div className="col-md-20 d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-light rounded-pill mx-1"
                          onClick={() => handleViewdetail(Doc.id)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-light rounded-pill mx-1"
                          onClick={() => {
                            let id = Doc.id;
                            navigate("/ConfigurerModel", { state: { id } });
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-light rounded-pill mx-1"
                          onClick={() => handleViewConfirme(Doc)}
                        >
                          <i className="bi bi-files"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-light rounded-pill mx-1"
                          onClick={() => handleViewdelete(Doc.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </Card.Footer>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
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
    {/*Détails */}
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
  {/* section delete project */}

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
 </>
 );
};


export default TableDoc;