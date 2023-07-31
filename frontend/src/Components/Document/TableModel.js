import React, { useEffect, useState } from "react";
import {
  getModel,
  getDocById,
  deleteDoc,
  AddProjecttoDoc,
} from "../../Api/DocApi";
import { useDispatch, useSelector } from "react-redux";
import { setDoc } from "../../store/DocSlice";
import { ProgressBar } from "react-bootstrap";

import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Loader } from "rsuite";
import CloneDoc from "./CloneDoc";

import Button from "@mui/material/Button";
import { Modal } from "react-bootstrap";
import Avatar from "react-avatar";

const TableModel = () => {
  //Call hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //Call Doc state from store

  const allDocs = useSelector((state) => state.Doc);
  const Projects = useSelector((state) => state.Project);
  const [isLoading, setisLoading] = useState(false);
  const [DocDetails, setDocDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [openConfirme, setOpenConfirme] = useState(false);
  const [Opendelete, setOpendelete] = useState(false);
  const [project, setproject] = useState("");
  const [IDproject, setIDproject] = useState("");
  const [Docs, setdocstate] = useState([]);
  const [openCloneDoc, setOpenCloneDoc] = useState(false);
  const [cloneModel, setClonedModel] = useState(null);
  const [docsFromBase, setDocsFromBase] = useState([]);

  //get data and set it in the store of Docs
  const getData = async () => {
    const data = await getModel();
    console.log(data);
    dispatch(setDoc(data));
    setDocsFromBase(data);
    setdocstate(data);
    setisLoading(!isLoading);
    console.log(isLoading);
  };
  const deleteandrefresh = async (id) => {
    setisLoading(true);

    await handleDelete(id);
    const data = await getModel();
    setisLoading(false);
    setdocstate(data);
    handleClosedelete();
  };
  //afficher les details
  const getDocDetails = async (docId) => {
    try {
      const data = await getDocById(docId);
      console.log(data);
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
  //ouvrir et fermer le modal du update project
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
  };
  const handleDelete = async (id) => {
    //Wait for the promise to show the noticifation
    await toast.promise(deleteDoc(id), {
      loading: "suppression...",
      // success: <b>Article deleted!</b>,
      //error: <b>Could not delete.</b>,
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

  const handleSearch = (event) => {
    const { value } = event.target;
    let docs = docsFromBase;
    docs = docs.filter(
      (d) => d.type.includes(value) || d.titre.includes(value)
    );
    setdocstate(docs);
  };

  //Call get data function
  useEffect(() => {
    getData();
  }, []);

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
      {!openCloneDoc && (
        <div>
          <div class="pagetitle">
            <nav>
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="">Acceuil</a>
                </li>
                <li class="breadcrumb-item">Modèle</li>
                <li class="breadcrumb-item active">Liste</li>
              </ol>
            </nav>
            <h1 className="text-center">Liste des modèles</h1>

            <nav class="d-flex mb-3">
              {localStorage.getItem("userRole") == "Admin" && (
                <button
                  type="button"
                  class="btn btn-light rounded-pill ms-auto p-2 "
                >
                  <a href="/createmodel">
                    <h1>
                      <i class="bi bi-file-earmark-plus"></i>
                    </h1>
                  </a>
                </button>
              )}
            </nav>
          </div>

          {/* Section get all Doc */}
          <div>
            <div className="row row-cols-1 my-4">
              <input
                type="text"
                name="search"
                onChange={handleSearch}
                className="form form-control"
              />
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4">
              {currentDocs.map((Doc) => (
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
                                <Card.Text className="text-center">
                                  <i className="bi bi-card-text text-Dark"></i>{" "}
                                  {Doc.type}
                                  {Doc.type === "Manuels d'utilisation" && (
                                    <span>
                                      {" "}
                                      <br />
                                      Description de l'utilisation du produit.
                                    </span>
                                  )}
                                  {Doc.type === "Guides de référence" && (
                                    <span>
                                      {" "}
                                      <br />
                                      Documentation de référence pour le
                                      produit.
                                    </span>
                                  )}
                                  {Doc.type === "Spécifications techniques" && (
                                    <span>
                                      {" "}
                                      <br />
                                      Détails techniques du produit.
                                    </span>
                                  )}
                                  {Doc.type === "Schémas et plans" && (
                                    <span>
                                      {" "}
                                      <br />
                                      Dessins et plans techniques.
                                    </span>
                                  )}
                                  {Doc.type ===
                                    "Procédures opérationnelles standard (SOP)" && (
                                    <span>
                                      {" "}
                                      <br />
                                      Instructions détaillées pour les
                                      opérations.
                                    </span>
                                  )}
                                  {Doc.type === "Rapports techniques" && (
                                    <span>
                                      {" "}
                                      <br />
                                      Analyses et résultats techniques.
                                    </span>
                                  )}
                                  {Doc.type === "Cahiers des charges" && (
                                    <span>
                                      {" "}
                                      <br />
                                      Exigences et spécifications détaillées.
                                    </span>
                                  )}
                                  {Doc.type === "Fiches techniques" && (
                                    <span>
                                      {" "}
                                      <br />
                                      Informations techniques synthétisées.
                                    </span>
                                  )}
                                </Card.Text>
                              </div>
                              <div className="justify-content-between text-Dark">
                                <br></br>
                                {/* <Card.Text>
                          <i className="bi bi-calendar3 text-Dark"> Date de creation : </i>{' '}
                          {new Date(Doc.created_at).toLocaleDateString()}
                        </Card.Text>*/}
                              </div>
                            </div>
                            <br></br>
                          </div>
                        </Card.Body>
                        <Card.Footer>
                          <div className="d-flex justify-content-center mx-auto my-auto">
                            {localStorage.getItem("userRole") === "Admin" && (
                              <button
                                type="button"
                                className="btn btn-light rounded-pill mx-1"
                                onClick={() => {
                                  let id = Doc.id;
                                  navigate("/ConfigurerModel", {
                                    state: { id },
                                  });
                                }}
                              >
                                <i class="bi bi-pencil-square"></i>
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-light rounded-pill mx-1"
                              onClick={() => handleViewConfirme(Doc)}
                            >
                              <i className="bi bi-files"></i>
                            </button>
                            {localStorage.getItem("userRole") === "Admin" && (
                              <button
                                type="button"
                                className="btn btn-light rounded-pill mx-1"
                                onClick={() => handleViewdelete(Doc.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
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
          <Modal show={open} onHide={handleClose} dialogClassName="my-modal">
            <Modal.Header closeButton>
              <h5 class="modal-title">Détails du Model</h5>
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
                          <i class=" bi-file-earmark-text" /> type :{" "}
                          {DocDetails.type}
                        </div>
                        <div className=" label text-dark">
                          <i class="bi bi-calendar2-date" />
                          Description : Ce Model est crée le{" "}
                          {new Date(
                            DocDetails.created_at.date
                          ).toLocaleDateString()}{" "}
                          par {DocDetails.created_by}
                        </div>
                        {DocDetails.updated_at && (
                          <div className=" label text-dark">
                            <i class="bi bi-journal-text"></i> La mis a jours
                            est affecté le{" "}
                            {new Date(
                              DocDetails.updated_at
                            ).toLocaleDateString()}{" "}
                            par {DocDetails.updated_by}
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <Loader />
              )}
            </Modal.Body>
            <Modal.Footer>
              {localStorage.getItem("userRole") == "Admin" && (
                <butoon
                  className="btn btn-primary"
                  onClick={() => {
                    let id = DocDetails.id;
                    navigate("/ConfigurerModel", { state: { id } });
                  }}
                >
                  {" "}
                  Modifier{" "}
                </butoon>
              )}
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
                    Voulez-vous vraiment supprimer ce model{" "}
                    <i class="text-danger">{DocDetails.Name}?</i>
                  </h5>
                  <div class="row">
                    <div class="col mb-5">
                      <div class="row g-3">
                        <div class="col mb-0 text-center">
                          <br></br>
                          <button
                            type="button"
                            class="btn btn-danger rounded-pill m-2"
                            onClick={() => {
                              deleteandrefresh(DocDetails.id);
                            }}
                          >
                            Oui
                          </button>
                          <Button
                            type="button"
                            class="btn btn-secondary rounded-pill m-2"
                            onClick={handleClosedelete}
                          >
                            Non
                          </Button>
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
          {/* section ADD project */}
        </div>
      )}

      {openCloneDoc && cloneModel && (
        <CloneDoc
          sourceModel={cloneModel}
          notifParentToHide={hideClone}
          multipleProject={false}
        />
      )}
    </>
  );
};

export default TableModel;
