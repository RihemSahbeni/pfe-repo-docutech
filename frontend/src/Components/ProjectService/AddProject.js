import React, { useEffect,useState } from "react";
import AsideBar from "../AsideBar/Asidebar";
import { useNavigate } from "react-router-dom";
import { addProject } from "../../Api/ProjectApi";
import toast from "react-hot-toast";
import { getUser } from "../../Api/UserApi";
import { setUser } from "../../store/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from 'react-avatar';
const AddProject = () => {
  const navigate = useNavigate();
  const [Title, setTitle] = useState("");
  const [ Description,  setDescription] = useState("");
  const [ EndDate,  setEndDate] = useState("");
  const [ StartDate,  setStartDate] = useState("");
  const [PUsers, setPUsers] = useState("");
  const Users = useSelector((state) => state.User);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState(null); 
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const [isSuccess,setISuccess]=useState(false);
  const [successMsg,setSuccessMsg]=useState(null);

  // get data and set it in the store of Users
    const getDataU = async () => {
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
  //Handle the user creation when click on the add button
  const handleAdd = () => {
    const projectData = {
      Title,
      Description,
      PUsers,
      StartDate,
      EndDate,
    };
  
    addProject(projectData)
      .then((response) => {
        if (response.status === 'error') {
          setError(response.message);
          setISuccess(false);
          setSuccessMsg(null);
          toast.error("Failed to create project");
        } else {
          setError(null);
          setISuccess(true);
          setSuccessMsg(response.message);
          toast.success("Project created successfully");
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.data);
        } else {
          console.log(error);
        }
        setError(error.message);
        setISuccess(false);
        setSuccessMsg(null);
        toast.error("Failed to create project");
      });
  
    navigate("/homeproject");
  };
  
  
  
  //Call get data function
  useEffect(() => {
    
    getDataU();
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
  
  <div> 
<AsideBar/>
    <div>
      <main id="main" class="main">
      <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="/home">Acceuil</a></li>
      <li class="breadcrumb-item">Projet</li>
      <li class="breadcrumb-item active">Nouveau</li>
    </ol>
  </nav>
<div class="card mx-auto w-50">
            <div class="card-body">
            <h5 class="card-title text-center">Nouveau Projet</h5>
     <div class="col-12">
              <div class="d-flex justify-content-between">  <label for="yourName" class="form-label"> Titre</label></div>
              <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-card-heading  text-primary "> </i></span>
                      <input type="text" name="name" class="form-control" id="yourName" required value={Title } onChange={(e) => setTitle(e.target.value)}/>
                      </div></div>
                      {error&&
                    <div class="col-8 mx-auto">
                      <div className="alert alert-danger">
                        {error}
                      </div>
</div>}
                      {/*{isSuccess&&
                    <div class="col-8 mx-auto">
                      <div className="alert alert-success">
                        {successMsg}
                      </div>
</div>}*/}
                    <div class="col-12">
                    <div class="d-flex justify-content-between"><label for="yourUsername" class="form-label">Description</label></div>
                    <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-people-fill  text-primary "> </i></span>
                      <input type="text" name="username" class="form-control" id="yourUsername" required  onChange={(e) => setDescription(e.target.value)}/>
                         </div></div>
                         
                         <div class="col-12">
                    <div class="d-flex justify-content-between"><label for="date" class="form-label">Date Début </label></div>
                    <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-people-fill  text-primary "> </i></span>
                      <input type="date" name="date" class="form-control" id="date" required  onChange={(e) => setStartDate(e.target.value)}/>
                         </div></div>
                         <div class="col-12">
                    <div class="d-flex justify-content-between"><label for="date" class="form-label">Date Fin </label></div>
                    <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend"><i class="bi bi-people-fill  text-primary "> </i></span>
                      <input type="date" name="date" class="form-control" id="dateE" required  onChange={(e) => setEndDate(e.target.value)}/>
                         </div></div>
                                     <div class="col-12">
                    <div class="d-flex justify-content-between"> <label for="id" class="form-label">Utilisateur </label></div>
                    <div class="input-group has-validation">
                       
                   
                    
                    
               {/* Bouton pour ouvrir le modal */}
<button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
<i class="bi bi-person-plus  text-primary "> </i> Choisir des utilisateurs
</button> 

{/* Modal contenant les cases à cocher */}
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Choisir des utilisateurs</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <div class="datatable-search">
                   
                      </div>
           
            <table class="table datatable">
           
  <thead>
    <tr>
      <th></th>
      <th scope="col">Utilisateur</th>
      <th scope="col">Select</th>
    </tr>
  </thead>
  <tbody>
  {currentItems.filter(user => user.status === "active").map((user, index) => (
    <tr key={user.id}>
      <td><Avatar name={`${user.firstname} ${user.lastname}`} size="40" round={true} /></td>
      <td>{user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)} {' '} 
      {user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1)}<br/> @ {' '}{user.email}</td><td>
        <input
          type="checkbox"
          id={user.id}
          name="users"
          value={user.id}
          onChange={(e) => {
            if (e.target.checked) {
              setPUsers([...PUsers, e.target.value]);
            } else {
              setPUsers(PUsers.filter(id => id !== e.target.value));
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
    </div></div>
</div>
    
    
 
</div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Sauvgarder </button>
            </div>  </div>
                    </div>
        </div>
    </div>
</div>

                <div class="text-center">
                <br></br>
                  <button type="submit" class="btn btn-primary"  onClick={() => handleAdd()} variant="primary">Sauvgarder</button>
          </div></div></div></main></div></div>
   
                
    );
  };
  
 
  
export default AddProject;
