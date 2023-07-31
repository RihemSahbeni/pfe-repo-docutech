import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../Api/UserApi";
import Avatar from "react-avatar";

export default function Navigator() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const session = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("email");
    const storedfirstname = localStorage.getItem("firstname");

    const storedlastname = localStorage.getItem("lastname");

    const id = localStorage.getItem("id");

    useEffect(() => {
        if (id) {
            getUserById(id)
                .then((data) => setUser(data))
                .catch((error) => console.log(error));
        }
    }, [id]);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("id");
        localStorage.removeItem("userRole");
        localStorage.removeItem("status");
        navigate("/login");
    };


    return (
      <header id="header" className="header fixed-top d-flex align-items-center">
       <div className="d-flex align-items-center justify-content-between">
            <a className="logo d-flex align-items-center">
            <img src="assets/img/wevioo.png" alt="" />
            
            </a>
           
          </div>
        {session ? (
          <div className="d-flex align-items-center justify-content-between">
            <a href="/" className="logo  align-items-right">
           
              <span className="d-none d-lg-block">DocuTech</span>
            </a>
           
          </div>
        ) : null}
    
        {session && (
          <>
            <div className="search-bar"></div>
    
            <nav className="header-nav ms-auto">
              <ul className="d-flex align-items-center">
                <li className="nav-item d-block d-lg-none">
                  <a className="nav-link nav-icon search-bar-toggle " href="#">
                    <i className="bi bi-search"></i>
                  </a>
                </li>
    
                <li className="nav-item dropdown pe-3">
                  <a
                    className="nav-link nav-profile d-flex align-items-center pe-0"
                    href="#"
                    data-bs-toggle="dropdown"
                  >
                    <Avatar
                      name={`${storedfirstname} ${storedlastname}`}
                      size="40"
                      round={true}
                    />
                    <span className="d-none d-md-block dropdown-toggle ps-2">
                      {storedfirstname} {storedlastname}
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                    <li className="dropdown-header">
                      <h6>{storedEmail}</h6>
                      <span>{userRole}</span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="/Profile"
                      >
                        <i className="bi bi-person-circle me-1"></i>
                        <span>My Profile</span>
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        className="dropdown-item d-flex align-items-center text-muted"
                        href="#"
                      >
                        <i className="bi bi-gear me-1"></i>
                        <span>Paramètres</span>
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-1"></i>
                        <span>Logout</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </>
        )}
      </header>
    );
        }