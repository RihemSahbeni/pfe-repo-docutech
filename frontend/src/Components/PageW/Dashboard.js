import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import AsideBar from "../AsideBar/Asidebar";
import { getUserById } from "../../Api/UserApi";
import { getProjectForUser } from "../../Api/ProjectApi";
import { getMyDoc } from "../../Api/DocApi";
import Statistique from "./Statistique";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [DocumentCount, setDocumentCount] = useState(0);

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);
  localStorage.setItem("decoded", decoded);
  const userRole = decoded.roles[0]; // extraire le rôle de l'utilisateur
  // stocker le rôle dans le Local Storage
  localStorage.setItem("userRole", userRole);
  console.log(decoded);

  useEffect(() => {
    if (id) {
      getUserById(id)
        .then((data) => setUser(data))
        .catch((error) => console.log(error));
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      getProjectForUser(user.id)
        .then((projects) => setProjectsCount(projects.length))
        .catch((error) => console.log(error));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getMyDoc(user.id)
        .then((documents) => setDocumentCount(documents.length))
        .catch((error) => console.log(error));
    }
  }, [user]);

  return (
    <div>
      <AsideBar />

      <main id="main" className="main">
        <div >
       <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Accueil</a>
              </li>
              <li className="breadcrumb-item active">Tableau de bord</li>
            </ol>
          </nav>
        </div>
        <div className="text-center pagetitle">
  <h1>Tableau de bord</h1>
</div>
<div>
        <section className="section dashboard ">
          {user && (
            <div className="col-lg-8 mx-auto">
              <div className="row">
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card sales-card  h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-people"></i>
                        </div>
                        <div className="ps-3">
                          <h1 className="card-title">
                            {user.firstname.charAt(0).toUpperCase()}
                            {user.firstname.slice(1)} {user.lastname}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card customers-card  h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <a
                            href="/homeMyProject"
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            <i className="bi bi-archive"></i>
                          </a>
                        </div>
                        <div className="ps-3">
                          <h5 className="card-title">Mes Projets</h5>
                          <span className="text-success small pt-1 fw-bold">
                            <span class="text-success small pt-1 fw-bold">
                              {projectsCount}
                            </span>
                            <span class="text-muted small pt-2 ps-1">
                              projet
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card revenue-card  h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <a
                            href="/MyDocHome"
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                          <i className="bi bi-journals"></i></a>
                        </div>
                        <div className="ps-3">
                          <h5 className="card-title">Mes Documents</h5>
                          <span className="text-success small pt-1 fw-bold">
                            <span class="text-success small pt-1 fw-bold">
                              {DocumentCount}
                            </span>
                            <span class="text-muted small pt-2 ps-1">
                              document
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="container">
  <div className="row mt-5">
    <div className="col-lg-10 mx-auto">
      <div className="card">
        <div className="card-body">
          <Statistique />
        </div>
      </div>
    </div>
  </div>
</div>

            </div>
          )}
        </section></div>
      </main>
    </div>
  );
};

export default Dashboard;
