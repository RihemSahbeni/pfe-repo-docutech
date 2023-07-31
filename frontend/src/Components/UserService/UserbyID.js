import { useEffect, useState } from "react";
import { getUserById } from "../../Api/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/UserSlice";
import toast  from "react-hot-toast";
import { useNavigate } from "react-router-dom";


//la page profil elle affiche les donnéé du user connecte seulement 
const UserById = () => {
  // Call hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Call User state from store
  const user = useSelector((state) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // get data and set it in the store of Users
  const getData = async () => {
    try {
      const data = await getUserById(); // get user by ID
      dispatch(setUser(data));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      toast.error("Failed to load data");
    }
  };
  // Call get data function
  useEffect(() => {
    setIsLoading(true);
    getData();
  }, []);

  return (
    <div>
      <br />
      <br />
      <br />
      <div>
        <aside id="sidebar" className="sidebar">
          <ul className="sidebar-nav" id="sidebar-nav">
            <li className="nav-item">
              <a className="nav-link collapsed" href="/dashboard">
                <i className="bi bi-grid"></i>
                <span>Dashboard</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link collapsed" data-bs-target="#icons-nav" data-bs-toggle="collapse">
                <i className="bi bi-person"></i>
                <span>
                  <a href="/home">Users</a>
                </span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul id="icons-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                <li>
                  <a href="/home">
                    <i className="bi bi-circle"></i>
                    <span>UserProfile</span>
                  </a>
                </li>
                <li>
                  <a href="/adduser">
                    <i className="bi bi-circle"></i>
                    <span>CreateUser</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </aside>
        <main main id="main" class="main">
        <section class="section profile">
      <div class="row">
       
        </div>

        <div class="col-xl-8">

          <div class="card">
            <div class="card-body pt-3">
              
              <ul class="nav nav-tabs nav-tabs-bordered">

                <li class="nav-item">
                  <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                </li>

               
              </ul>
              <div class="tab-content pt-2">

                <h5 className="card-title">Profile Details</h5>
                <br></br>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">FirstName</div>
                  <div className="col-lg-9 col-md-8">{user.firstname}</div>
                </div>
                <br></br>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">LasttName</div>
                  <div className="col-lg-9 col-md-8">{user.lastname}</div>
                </div>
                <br></br>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">Email</div>
                  <div className="col-lg-9 col-md-8">{user.email}</div>
                </div>
                <br></br>
                <div className="row">
                  <div className="col-lg-3 col-md-4 label">PhoneNumber</div>
                  <div className="col-lg-9 col-md-8">{user.phoneNumber}</div>
              </div></div></div></div></div></section></main></div></div>
   );
 };

export default UserById;
