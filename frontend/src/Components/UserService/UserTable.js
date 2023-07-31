import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { getUser } from "../../Api/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/UserSlice";
import { getUserById, updateUserStatus, updateUserStatusActive } from '../../Api/UserApi';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "rsuite";
import Button from "@mui/material/Button";
import { Badge, Modal } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { Hypnosis } from "react-cssfx-loading";

const UserTable = () => {
  // Call hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Call User state from store
  const Users = useSelector((state) => state.User);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [isStatusFilter,setIsStatusFilter]=useState(false);
  const [filterValue,setFilterValue]=useState("");

  const handleEditUserStatus = async (userId) => {
  try {
    const edited = await updateUserStatus(userId, { status: 'Inactive' });
    console.log(edited); // vérifier la réponse du serveur
    toast.success("User désactivé !");
    handleCloses();

    // Recharger la page
    window.location.reload();
  } catch (error) {
    console.log(error.response); // Affiche la réponse d'erreur du serveur
    //toast.error("Could not edit user.");
  }
};

  
  const handleEditUserStatusActive = async (userId) => {
    try {
      const edited = await updateUserStatusActive(userId, { status: 'Active' });
      console.log(edited); // vérifier la réponse du serveur
      toast.success("User activé !");
      handleCloseA();
  
      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.log(error.response); // Affiche la réponse d'erreur du serveur
      //toast.error("Could not edit user.");
    }
  };
  
  //afficher les details 
  const getUserDetails = async (userId) => {
    try {
      const data = await getUserById(userId);
      // utilisez l'API pour obtenir les détails de l'utilisateur
      setUserDetails(data); // mettre à jour l'état des détails de l'utilisateur
    } catch (err) {
      console.error(err);
    }
  };
  const handleViewUserStatus = (userId) => {
    getUserDetails(userId); // appel de la méthode pour obtenir les détails de l'utilisateur
    setOpenS(true);
  };
  const handleViewUserStatusActive = (userId) => {
    getUserDetails(userId); // appel de la méthode pour obtenir les détails de l'utilisateur
    setOpenA(true);
  };
  const handleViewUser = (userId) => {
    getUserDetails(userId); // appel de la méthode pour obtenir les détails de l'utilisateur
    setOpen(true);
  };
  const handleClose = () => {
    setUserDetails(null);
    setOpen(false);
  };
  const handleCloses = () => {
    setUserDetails(null);
    setOpenS(false);
  };
  const handleCloseA = () => {
    setUserDetails(null);
    setOpenA(false);
  };
  // get data and set it in the store of Users
  const getData = async () => {
    try {
      const data = await getUser();
      dispatch(setUser(data));
      setisLoading(true);
    } catch (err) {
      setError(err.message);
      setisLoading(false);
      toast.error("Failed to load data");
    }
  };
  const removeFilter=()=>{
    setFilterValue(null);
    setIsStatusFilter(false);
    if(searchTerm&&searchResults&&searchTerm!=""){
      let results = Users.filter((user) => {
      

        const fullName = `${user.firstname} ${user.lastname} ${user.email} ${user.phoneNumber}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
      })
      setSearchResults(results);
    }else{
      setSearchResults(null);

    }
  }
  const handleFilter=(value)=>{
    setFilterValue(value);
    if(searchResults){
      const results=searchResults.filter((u)=>u.status===value);
      setSearchResults(results);
      setIsStatusFilter(true);

    }else{
      const results=Users.filter((u)=>u.status===value);
      setSearchResults(results);
      setIsStatusFilter(true);
    }

  }
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    if(value!=""){
    let results = Users.filter((user) => {
      

      const fullName = `${user.firstname} ${user.lastname} ${user.email} ${user.phoneNumber}`;
      return fullName.toLowerCase().includes(value.toLowerCase());
    });
      console.log(results);
    if(isStatusFilter){
      results=results.filter((u)=>u.status===filterValue);
    }

    setSearchResults(results);
  }else{
    if(isStatusFilter){
      const results=Users.filter((u)=>u.status===filterValue);
      setSearchResults(results);        
      
    }else{
    setSearchResults(null);
    }

  }
  };


  useEffect(() => {
    setisLoading(true);
    getData();
  }, []);

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

  return (
    <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
      <div className="pagetitle">
      
      <nav>
  <ol className="breadcrumb">
    <li className="breadcrumb-item"><a href="index.html">Accueil</a></li>
    <li className="breadcrumb-item">Liste </li>
    <li className="breadcrumb-item active">Utilisateurs</li>
  </ol>
</nav>
<h1 className="text-center">Liste des utilisateurs</h1>
<nav className="d-flex justify-content-end">
  <div className="pagetitle">
    {/* <button type="button" className="btn btn-light rounded-pill mx-1">
     <a href="/adduser"><h1><i className="bi bi-person-plus-fill"></i></h1></a></button>*/}
  </div>
</nav>


      </div>
      <div>
        <section className="section">
          
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-end mt-2">
                    {isStatusFilter&&
                    <h6 style={{"cursor":"pointer"}}><Badge className="me-2"  pill  bg={"danger"} onClick={removeFilter}>Remove Filter</Badge></h6>
                    }

                   <h6 style={{"cursor":"pointer"}} onClick={()=>handleFilter("active")}><Badge className="me-2"  pill  bg={"primary"}>Active</Badge></h6>
                   <h6 style={{"cursor":"pointer"}} onClick={()=>handleFilter("Inactive")}><Badge pill  bg={"warning"}>Inactive</Badge></h6>
                   </div>
                      <div className="row mb-2 mt-3">
                        <label className="col-3">
                         
                        
                          <select
                            className="form-select "
                            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                          >

                            <option value="10" >
                              10
                            </option>
                            <option value="5" >5</option>
                          </select>
                          </label>
                          
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
                       

                      <Toaster position="top-right" />

                      <div className="datatable-scroll">
                        <Table className="table datatable">
                          <thead>
                            <tr>

                              <th> </th>
                              <th scope="col">Nom</th>
                              <th scope="col">Prénom</th>
                              <th scope="col">Email</th>
                              <th scope="col">Téléphone</th>
                              <th scope="col">Statut</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Users[0].id=="none"?(
                              <tr>
                                <td colSpan={7}>
                                <Hypnosis color="#a6cee3
  " width="100px"  height="100px" duration="3s" />
                                </td>
                              </tr>
                              ):(
                                searchResults==null?(
                                  currentItems.map((User, index) => (
                                    <tr key={User._id}>
                                      <td><Avatar name={`${User.firstname} ${User.lastname}`} size="40" round={true} /></td>
                                      <td>{User.firstname}</td>
                                      <td>{User.lastname}</td>
                                      <td>{User.email}</td>
                                      <td>{User.phoneNumber}</td>
                                      <td className={User.status === "active" ? "text-primary" : "text-warning"}>
                                        {User.status}
                                      </td>
      
      
      
                                      <td><button type="button" className="btn btn-light rounded-pill" onClick={() => handleViewUser(User.id)}><i className="bi bi-hurricane"></i></button>
                                        {User.status === "active" ? (
                                          <button type="button" className="btn btn-light rounded-pill" onClick={() => handleViewUserStatus(User.id)}><i className="bi bi-person-dash"></i></button>
                                        ) : (
                                          <button type="button" className="btn btn-light rounded-pill" onClick={() => handleViewUserStatusActive(User.id)}><i className="bi bi-person-check"></i></button>
                                        )}
                                      </td>
      
      
                                    </tr>
                                  ))
  
  
                                ):(
                                  searchResults.map((User, index) => (
                                    <tr key={User._id}>
                                      <td><Avatar name={`${User.firstname} ${User.lastname}`} size="40" round={true} /></td>
                                      <td>{User.firstname}</td>
                                      <td>{User.lastname}</td>
                                      <td>{User.email}</td>
                                      <td>{User.phoneNumber}</td>
                                      <td className={User.status === "active" ? "text-primary" : "text-warning"}>
                                        {User.status}
                                      </td>
      
      
      
                                      <td><button type="button" className="btn btn-light rounded-pill" onClick={() => handleViewUser(User.id)}><i className="bi bi-hurricane"></i></button>
                                        {User.status === "active" ? (
                                          <button type="button" className="btn btn-light rounded-pill" onClick={() => handleViewUserStatus(User.id)}><i className="bi bi-person-dash"></i></button>
                                        ) : (
                                          <button type="button" className="btn btn-light rounded-pill" onClick={() => handleViewUserStatusActive(User.id)}><i className="bi bi-person-check"></i></button>
                                        )}
                                      </td>
      
      
                                    </tr>
                                  ))
  
                                  )
                              )
                            }
                            
                          </tbody>
                        </Table>
                      </div>
                      {searchResults==null&&
                      <div className="datatable-bottom">
                        <div className="datatable-info">
                          Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {Users.length} entries
                        </div>
                        <div className="datatable-pagination">
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
                      </div>
                  }
                </div></div></div></div></section></div>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <h5 className="modal-title">Détails de l'utilisateur</h5>
        </Modal.Header>
        <Modal.Body>
          {userDetails ? (


            <div>
              <div >
                <form className="row g-3">
                  <br></br>
                  <br></br>
                  <div className="row">
                    <div className="col-lg-3 col-md-4 label text-dark"><i className="bi bi-person">  </i>Nom</div>
                    <div className="col-lg-3 col-md-4">{userDetails.firstname}</div>
                  </div>
                  <br></br>
                  <br></br>
                  <div className="row">
                    <div className="col-lg-3 col-md-4 label   text-dark"><i className="bi bi-person-fill">  </i>Prénom</div>
                    <div className="col-lg-3 col-md-4">{userDetails.lastname}</div>
                  </div>
                  <br></br>

                  <br></br>
                  <div className="row">
                    <div className="col-lg-3 col-md-4 label text-dark"><i className="bi bi-at">  </i>Email</div>
                    <div className="col-lg-4 col-md-5">{userDetails.email}</div>
                  </div>
                  <br></br>
                  <br></br>

                  <div className="row">
                    <div className="col-lg-3 col-md-4 label text-dark"><i className="bi bi-telephone-fill"></i>Phone</div>
                    <div className="col-lg-4 col-md-5">{userDetails.phoneNumber}</div>
                  </div>


                </form></div></div>


          ) : (
            <Loader />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fermer</Button>
        </Modal.Footer>
      </Modal>
      <div>
        <Modal show={openS} onHide={handleCloses}>

          <Modal.Body>
            {userDetails ? (

              <div>
                <div >
                  <form className="row g-3">


                  <div className="modal-body">
  <div>
    <h5 className="text-Dark text-center">
      <i className="bi bi-exclamation-triangle me-1 text-warning"></i>
      Voulez-vous désactiver le compte de cet utilisateur <i className="text-warning"> <br></br>{userDetails.firstname} {userDetails.lastname}</i>  ?
    </h5>
    <br></br>
    <br></br>
    <div className="row justify-content-center">
      <div className="col-6 mb-5 d-flex justify-content-between">
        <button type="button" className="btn btn-warning rounded-pill flex-fill me-2" onClick={() => handleEditUserStatus(userDetails.id)}>Oui</button>
        <button className="btn btn-secondary rounded-pill flex-fill" tabIndex="0" type="button" onClick={handleCloses}>Non</button>
      </div>
    </div>
  </div>
</div>



                  </form></div></div>
            ) : (
              < h1 />
            )}
          </Modal.Body>

        </Modal>
      </div>
      <div>
        <Modal show={openA} onHide={handleCloseA}>

          <Modal.Body>
            {userDetails ? (

              <div>
                <div >
                  <form className="row g-3">
 <div className="modal-body">
  <div>
    <h5 className="text-dark text-center">
      <i className="bi bi-info-circle me-1 text-info"></i>
      Voulez-vous activer le compte de cet utilisateur <i className="text-info"> <br></br>{userDetails.firstname} {userDetails.lastname}</i>  ?
    </h5>
    <br></br>
    <br></br>
    <div className="row justify-content-center">
    <div className="col-6 mb-5 d-flex justify-content-between">
        <button type="button" className="btn btn-info rounded-pill flex-fill me-2"onClick={() => handleEditUserStatusActive(userDetails.id)}>Oui     </button>
        <button className="btn btn-secondary rounded-pill flex-fill"onClick={handleCloseA}>Non
        </button>
      </div>
    </div>
  </div>
</div>


                  </form></div></div>
            ) : (
              < h1 />
            )}
          </Modal.Body>

        </Modal>
      </div>
    </div>
  );
};

export default UserTable;