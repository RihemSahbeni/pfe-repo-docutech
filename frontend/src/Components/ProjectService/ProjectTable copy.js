import React, { useEffect, useState } from "react";
import {
  getProjectById,
  getProject,
  updateProject,
  AddusertoProject,
  deleteproject,
  deleteUserfromproject,
} from "../../Api/ProjectApi";
import { useDispatch, useSelector } from "react-redux";
import { setProject } from "../../store/ProjectSlice";
import { getUser } from "../../Api/UserApi";
import { setUser } from "../../store/UserSlice";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Loader } from "rsuite";
import { Hypnosis } from "react-cssfx-loading";
import Button from "@mui/material/Button";
import { Modal } from "react-bootstrap";
import Avatar from "react-avatar";
import AsideBar from "../AsideBar/Asidebar";
import { ProgressBar } from "react-bootstrap";
const ProjectTable = () => {
  //Call hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Call Project state from store
  const [projectId, setProjectId] = useState("");
  const Projects = useSelector((state) => state.Project);
  const [isLoading, setisLoading] = useState(false);
  const [projectDetails, setprojectDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState(null);
  const Users = useSelector((state) => state.User);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [open, setOpen] = useState(false);
  const [openupdate, setOpenupdate] = useState(false);
  const [openadd, setOpenadd] = useState(false);
  const [Opendelete, setOpendelete] = useState(false);
  const [isDateFilter, setIsDateFilter] = useState(false);
  const connectedUserId = localStorage.getItem("id");
  console.log(connectedUserId);
  const [dateIntervale, setDateIntervale] = useState({
    dateDebut: null,
    dateFin: null,
  });

  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [CreationDate, setCreationDate] = useState("");
  const [PUsers, setPUsers] = useState("");

  const [currentPagep, setCurrentPagep] = useState(1);

  const itemsPerPagep = 6;

  const indexOfLastItemp = currentPagep * itemsPerPagep;
  const indexOfFirstItemp = indexOfLastItemp - itemsPerPagep;
  const currentItemsp = Projects.slice(indexOfFirstItemp, indexOfLastItemp);

  const paginatep = (pageNumber) => {
    setCurrentPagep(pageNumber);
  };

  const pageNumbersp = [];
  for (let i = 1; i <= Math.ceil(Projects.length / itemsPerPagep); i++) {
    pageNumbersp.push(i);
  }
  function goToDoocs(id) {
    navigate("/DocsParProjet", { state: { id } });

    console.log(id);
  }

  //afficher les details
  const getProjectDetails = async (projectId) => {
    try {
      const data = await getProjectById(projectId);
      // utilisez l'API pour obtenir les détails de l'utilisateur
      setprojectDetails(data); // mettre à jour l'état des détails de l'utilisateur
      console.log(data);
      setTitle(data.Title);
      setDescription(data.Description);
      setPUsers(data.PUsers);
    } catch (err) {
      console.error(err);
    }
  };
  //to open modal details project by id
  const handleViewProject = (projectId) => {
    getProjectDetails(projectId); // appel de la méthode pour obtenir les détails du projet
    setOpen(true);
  };
  const handleClose = () => {
    setprojectDetails(null);
    setOpen(false);
  };

  //get data and set it in the store of Projects
  const getData = async () => {
    const data = await getProject();
    console.log(data);

    dispatch(setProject(data));
    setisLoading(!isLoading);
    console.log(isLoading);
  };

  //get user pour afficher dans liste selection user to affect to project
  // get data and set it in the store of Users
  const getDataU = async () => {
    try {
      const dataU = await getUser();
      dispatch(setUser(dataU));
      setisLoading(true);
    } catch (err) {
      setError(err.message);
      setisLoading(false);
      toast.error("Failed to load data");
    }
  };

  //Count the Project number
  let count = 1;
  //Call get data function
  useEffect(() => {
    getData();
    getDataU();
  }, []);

  /*section du update project*/

  // Handle the project edition when click on the edit button
  const handleEditProject = (id) => {
    toast
      .promise(updateProject(id, { Title, Description, PUsers }), {
        loading: "Editing...",
        success: <b>Project Edited!</b>,
        error: <b>Could not Edit Project.</b>,
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          toast.error("You are not authorized to modify this project");
        }
      });
  };
  //ouvrir et fermer le modal du update project
  const handleCloseedit = () => {
    setprojectDetails(null);
    setOpenupdate(false);
  };
  const handleViewedit = (projectId) => {
    getProjectDetails(projectId); // appel de la méthode pour obtenir les détails de l'utilisateur
    setOpenupdate(true);
  };

  /*end section du update project*/

  /*section add user to project*/
  // Handle the affect user to project when click on the edd button
  const handleAddusertoProject = (id) => {
    toast.promise(AddusertoProject(id, { PUsers }), {
      loading: "Creating...",
      success: <b>User has been Created !</b>,
      error: <b>Could not Create account .</b>,
    });
  };

  const handleCloseAddusertoProject = () => {
    setprojectDetails(null);
    setOpenadd(false);
  };
  const handleViewAddusertoProject = (projectId) => {
    getProjectDetails(projectId); // appel de la méthode pour obtenir les détails de projet
    setOpenadd(true);
  };

  /*end section du add user to project*/

  /*section modal delete project*/

  const handleDelete = (id) => {
    // Wait for the promise to show the notification
    toast
      .promise(deleteproject(id), {
        loading: "deleting...",
        success: <b>Projet supprimé !</b>,
        error: <b>Could not delete.</b>,
      })
      .then(() => {
        // Refresh the page after deletion
        window.location.reload();
      });
  };

  const handleDeleteUser = (projectId, userId) => {
    // Attendre la promesse pour afficher la notification
    toast
      .promise(deleteUserfromproject(projectId, userId), {
        loading: "Suppression en cours...",
        success: <b>Utilisateur supprimé du projet !</b>,
        error: <b>Impossible de supprimer l'utilisateur du projet.</b>,
      })
      .then(() => {
        // Actualiser la page après la suppression
        // window.location.reload();
        getProjectDetails(projectId);
      });
  };

  const handleViewProjectdelete = (projectId) => {
    getProjectDetails(projectId); // appel de la méthode pour obtenir les détails de l'utilisateur
    setOpendelete(true);
  };

  const handleClosedelete = () => {
    setprojectDetails(null);
    setOpendelete(false);
  };
  /*section modal delete project*/

  /*section pagination*/
  // Logic for displaying Users
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Users.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(Users.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value !== "") {
      const results = Projects.filter((project) => {
        const projectName = project.Title.toLowerCase();

        const nameMatch = projectName.includes(value.toLowerCase());

        return nameMatch;
      });
      console.log(results);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };
  const clearDateIntervale = () => {
    setDateIntervale({
      dateDebut: null,
      dateFin: null,
    });
    setSearchResults(null);
  };
  const handleDateInputChange = (event) => {
    const { name, value } = event.target;
    setDateIntervale((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFilterByDate = () => {
    let filteredData = Projects.filter((project) => {
      const startDate = new Date(dateIntervale.dateDebut);
      startDate.setHours(0, 0, 0, 0); // Set time to midnight
      const endDate =
        dateIntervale.dateFin !== null ? new Date(dateIntervale.dateFin) : null;
      if (endDate) {
        endDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
      }
      const projectDate = new Date(project.CreationDate.date);
      projectDate.setHours(0, 0, 0, 0); // Set time to midnight

      if (endDate) {
        return projectDate >= startDate && projectDate <= endDate;
      } else {
        console.log(projectDate, startDate);
        return projectDate >= startDate;
      }
    });
    setSearchResults(filteredData);
    setIsDateFilter(true);
  };

  useEffect(() => {
    setisLoading(true);
    getData();
  }, []);

  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  ); // Date actuelle du système

  useEffect(() => {
    // Récupérer la date stockée dans le stockage local
    const storedDate = localStorage.getItem("currentDate");

    if (storedDate) {
      // Mettre à jour les valeurs de startDate et endDate avec la date stockée
      setStartDate(storedDate);
      setEndDate(storedDate);
    }
  }, []);
  return (
    <div>
      <AsideBar />
      <div class="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
        <div class="pagetitle">
          <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="">Acceuil</a>
              </li>
              <li class="breadcrumb-item">Projet</li>
              <li class="breadcrumb-item active">Liste</li>
            </ol>
          </nav>
          <div class="text-center">
            <h1>Les projets</h1>
          </div>
          <nav class="d-flex justify-content-end">
            <div class="pagetitle">
              <button type="button" class="btn btn-light rounded-pill mx-1">
                <a href="/createproject">
                  <h1>+</h1>
                </a>
              </button>
              <button type="button" class="btn btn-light rounded-pill mx-1">
                <a href="/homeMyProject">
                  <h1>
                    <i class="bi bi-archive"></i>
                  </h1>
                </a>
              </button>
            </div>
          </nav>
        </div>
      </div>
      <div>
        <div className="card-body">
          <div className="row mb-2">
            <div className="col-4">
              <label htmlFor="dateDebut">Start Date:</label>
              <input
                type="date"
                id="dateDebut"
                name="dateDebut"
                className="form-control"
                value={dateIntervale.dateDebut || ""}
                onChange={handleDateInputChange}
              />
            </div>

            <div className="col">
              <label htmlFor="dateFin">End Date:</label>
              <input
                type="date"
                id="dateFin"
                name="dateFin"
                className="form-control"
                value={dateIntervale.dateFin || ""}
                onChange={handleDateInputChange}
              />
            </div>
            {dateIntervale.dateFin || dateIntervale.dateDebut ? (
              <>
                <div className="col-3">
                  <label style={{ color: "white" }}>.</label>
                  <button
                    className="  form-control btn btn-warning"
                    onClick={handleFilterByDate}
                  >
                    Chercher Par date
                  </button>
                </div>

                <div className="col-1">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={clearDateIntervale}
                  >
                    X
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <div className="row mt-1">
            <div className="col">
              <input
                className="form-control"
                placeholder="Search..."
                type="search"
                title="Search within table"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {Projects && Projects[0] === "none" ? (
            <div className="col-6 mx-auto mt-5">
              <Hypnosis
                color="#a6cee3"
                width="100px"
                height="100px"
                duration="3s"
              />
            </div>
          ) : (
            (searchResults ? searchResults : currentItemsp).map((project) => (
              <div className="col" key={project.id}>
                <div className="card mb-0" style={{ height: "300px" }}>
                  <div className="row g-0">
                    <div className="col-md-10">
                      <Card.Body>
                        <div className="d-flex justify-content-center align-items-center mb-2">
                          <Avatar
                            name={project.Title}
                            size="50"
                            round={true}
                            className="me-3"
                            style={{ backgroundColor: "#1976d2" }}
                          />
                          <Card.Title>
                            <h4>{project.Title}</h4>
                          </Card.Title>
                        </div>
                        <div className="col-md-20">
                          <div className="card-text">
                            <div className="justify-content-between text-Dark">
                              <Card.Text>
                                <i className="bi bi-justify text-Dark"></i>{" "}
                                {project.Description
                                  ? project.Description
                                  : "La description n'est pas encore écrite"}
                              </Card.Text>
                            </div>
                            <div className="justify-content-between text-Dark">
                              <Card.Text>
                                <i className="bi bi-justify text-Dark"></i>{" "}
                                {project.CreationDate.date
                                  ? new Date(
                                      project.CreationDate.date
                                    ).toLocaleDateString()
                                  : "La description n'est pas encore écrite"}
                              </Card.Text>
                            </div>
                            <div className="justify-content-between text-Dark">
                              <Card.Text>
                                {/* <i className="bi bi-clock-history text-Dark"> Progresse</i>
  <div style={{ height: '20px' }}>
    {StartDate === currentDate && StartDate !== '' ? (
      <ProgressBar now={10} variant="danger" style={{ height: '4px' }} />
    ) : null}

    {StartDate < currentDate && currentDate < EndDate ? (
      <ProgressBar
        now={50}
        variant="info"
        className="my-3 small-progress-bar"
        style={{ height: '4px' }}
      />
    ) : null}

    {currentDate === EndDate && StartDate !== currentDate && StartDate !== '' ? (
      <ProgressBar
        now={100}
        className="my-3 small-progress-bar"
        style={{ height: '4px' }}
      />
    ) : null}
  </div>*/}
                              </Card.Text>
                            </div>
                          </div>
                        </div>
                        <Card.Footer>
                          <div className="col-md-20 d-flex justify-content-center">
                            <button
                              type="button"
                              className="btn btn-light rounded-pill mx-1"
                              onClick={() =>
                                handleViewAddusertoProject(project.id)
                              }
                            >
                              <i className="bi bi-person-plus"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-light rounded-pill mx-1"
                              onClick={() => handleViewProject(project.id)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            {Number(project.creator_id) ===
                              Number(connectedUserId) && (
                              <button
                                type="button"
                                className="btn btn-light rounded-pill mx-1"
                                onClick={() => handleViewedit(project.id)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                            )}

                            <button
                              type="button"
                              className="btn btn-light rounded-pill mx-1"
                              onClick={() =>
                                handleViewProjectdelete(project.id)
                              }
                            >
                              <i className="bi bi-trash"></i>
                            </button>

                            <button
                              type="button"
                              className="btn btn-light rounded-pill mx-1"
                              onClick={() => goToDoocs(project.id)}
                            >
                              <i class="bi bi-journals"></i>
                            </button>
                          </div>
                        </Card.Footer>
                      </Card.Body>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <ul className="pagination">
          {pageNumbersp.map((pageNumber) => (
            <li key={pageNumber} className="page-item">
              <a
                onClick={() => paginatep(pageNumber)}
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
          <h5 className="modal-title">Détails du projet</h5>
        </Modal.Header>
        <Modal.Body>
          {projectDetails && (
            <div>
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <Avatar
                      name={projectDetails.Title}
                      size="50"
                      round={true}
                      className="me-3"
                      style={{ backgroundColor: "#1976d2" }}
                    />
                    <h4>{projectDetails.Title}</h4>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <form className="row g-3">
                    <div className="col-md-6 label text-dark">
                      <i className="bi bi-person-fill" /> Créateur
                    </div>
                    <div className="col-md-6">
                      {`${projectDetails.Creator.firstname} ${projectDetails.Creator.lastname}`}{" "}
                      - {projectDetails.Creator.email}
                    </div>

                    <div className="col-md-6 label text-dark">
                      <i className="bi bi-calendar2-date" /> Date de création
                    </div>
                    <div className="col-md-6">
                      {projectDetails.CreationDate && (
                        <p>
                          {new Date(
                            projectDetails.CreationDate.date
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 label text-dark">
                      <i className="bi bi-calendar2-date" /> Date de début
                    </div>
                    <div className="col-md-6">
                      {projectDetails.StartDate && (
                        <p>
                          {new Date(
                            projectDetails.StartDate.date
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 label text-dark">
                      <i className="bi bi-calendar2-date" /> Date de fin
                    </div>
                    <div className="col-md-6">
                      {projectDetails.EndDate && (
                        <p>
                          {new Date(
                            projectDetails.EndDate.date
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="col-md-6 label text-dark">
                      <i className="bi bi-people"></i> Utilisateurs
                    </div>
                    <div className="col-md-12">
                      <div className="avatar-container d-flex flex-wrap">
                        {projectDetails.PUsers.map(
                          (user, index) =>
                            index < 20 && (
                              <div
                                key={user.id}
                                className="avatar-wrapper mb-2"
                              >
                                <span
                                  className="cross-icon"
                                  onClick={() =>
                                    handleDeleteUser(projectDetails.id, user.id)
                                  }
                                >
                                  <i className="bi bi-x-circle-fill me-1"></i>
                                </span>
                                <Avatar
                                  name={`${user.firstname} ${user.lastname}`}
                                  size="30"
                                  round={true}
                                  className="me-2"
                                  style={{ backgroundColor: "#f0fffa" }}
                                />
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Section update project */}
      <Modal
        class="modal-dialog modal-dialog-centered"
        show={openupdate}
        onHide={handleCloseedit}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {projectDetails ? (
            <div>
              <div>
                <div>
                  <div class="texte-modal-sect col-md-9">
                    <div class="modal-body">
                      <div class="d-flex justify-content-center align-items-center mb-2">
                        <Avatar
                          name={projectDetails.Title}
                          size="50"
                          round={true}
                          className="me-3"
                          style={{ backgroundColor: "#1976d2" }}
                        />
                        <Card.Title>
                          <h4>{projectDetails.Title}</h4>
                        </Card.Title>
                      </div>
                      <div class="row">
                        <div class="col mb-3">
                          <label for="nameWithTitle" class="form-label">
                            Titre
                          </label>
                          <input
                            type="text"
                            id="nameWithTitle"
                            class="form-control"
                            value={Title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div class="row">
                        <div class="col mb-3">
                          <label for="nameWithTitle" class="form-label">
                            Description{" "}
                          </label>
                          <input
                            type="text"
                            id="nameWithTitle"
                            class="form-control"
                            value={Description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col mb-0">
                          <label for="dobWithTitle" class="form-label">
                            {" "}
                            <i class="bi bi-calendar4-week text-primary "> </i>
                            Date debut
                          </label>
                          <input
                            type="date"
                            id="dobWithTitle"
                            class="form-control"
                            placeholder={projectDetails.StartDate}
                            value={projectDetails.StartDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div class="col mb-0">
                          <label for="dobWithTitle" class="form-label">
                            {" "}
                            <i class="bi bi-calendar4-week text-primary "> </i>
                            Date Fin
                          </label>
                          <input
                            type="date"
                            id="dobWithTitle"
                            class="form-control"
                            placeholder={projectDetails.EndDate}
                            value={projectDetails.EndDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Loader />
          )}
          <div>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseedit}>
            Fermer
          </Button>
          <button
            type="button"
            class="btn btn-primary"
            onClick={() =>
              handleEditProject(projectDetails.id, Title, CreationDate)
            }
          >
            Sauvgarder
          </button>
        </Modal.Footer>
      </Modal>

      {/* Section add user to project */}
      <Modal
        class="modal-dialog modal-dialog-centered"
        show={openadd}
        onHide={handleCloseAddusertoProject}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {projectDetails ? (
            <div>
              <div>
                <div>
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      Choisir des utilisateurs
                    </h5>
                  </div>
                  <div class="modal-body">
                    <div class="datatable-search"></div>

                    <table class="table datatable">
                      <thead>
                        <tr>
                          <th></th>
                          <th scope="col">Utilisateur</th>
                          <th scope="col">Choisir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems
                          .filter((user) => user.status === "active")
                          .map((user, index) => (
                            <tr key={user.id}>
                              <td>
                                <Avatar
                                  name={`${user.firstname} ${user.lastname}`}
                                  size="40"
                                  round={true}
                                />
                              </td>
                              <td>
                                {user.firstname.charAt(0).toUpperCase() +
                                  user.firstname.slice(1)}{" "}
                                {user.lastname.charAt(0).toUpperCase() +
                                  user.lastname.slice(1)}
                                <br />@ {user.email}
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  id={user.id}
                                  name="users"
                                  value={user.id}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setPUsers([...PUsers, e.target.value]);
                                    } else {
                                      setPUsers(
                                        PUsers.filter(
                                          (id) => id !== e.target.value
                                        )
                                      );
                                    }
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div>
                      <div class="datatable-bottom">
                        <div class="datatable-info">
                          <div class="datatable-pagination">
                            <ul class="pagination">
                              {pageNumbers.map((pageNumber) => (
                                <li key={pageNumber} class="page-item">
                                  <a
                                    onClick={() => paginate(pageNumber)}
                                    href="#"
                                    class="page-link"
                                  >
                                    {pageNumber}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddusertoProject}>
            Fermer
          </Button>
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => handleAddusertoProject(projectDetails.id, PUsers)}
          >
            Sauvgarder
          </button>
        </Modal.Footer>
      </Modal>

      {/* section delete project */}

      <Modal show={Opendelete} onHide={handleClosedelete} closeButton>
        <Modal.Body>
          {projectDetails ? (
            <div>
              <h5 class="text-center text-dark">
                <i class="bi bi-exclamation-octagon me-1 text-danger"></i>
                Voulez-vous vraiment supprimer ce projet{" "}
                <i class="text-danger">{projectDetails.Title}?</i>
              </h5>
              <br />
              <br />
              <div class="row">
                <div class="col mb-5">
                  <div class="row">
                    <div class="col mb-5">
                      <div class="row g-3">
                        <div class="col text-center">
                          <div class="d-inline-flex">
                            <button
                              type="button"
                              class="btn btn-danger rounded-pill me-2"
                              onClick={() => {
                                handleDelete(projectDetails.id);
                                handleClosedelete();
                              }}
                            >
                              Oui
                            </button>
                            <Button
                              type="button"
                              class="btn btn-secondary rounded-pill"
                              onClick={handleClosedelete}
                            >
                              Non
                            </Button>
                          </div>
                        </div>
                      </div>
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
  );
};

export default ProjectTable;
