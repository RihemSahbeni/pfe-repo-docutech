import React from "react";

const Error = () => {
  const winX = window.innerWidth + "px";
  const winY = window.innerHeight + "px";
  return (
    <div>
     <main>
    <div class="container">

      <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1>404</h1>
        <h2>The page you are looking for doesn't exist.</h2>
        <a class="btn" href="/dashboard">Back to home</a>
        <img src="assets/img/not-found.svg" class="img-fluid py-5" alt="Page Not Found"/>
        <div class="credits">
         
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div>
      </section>

    </div>
  </main>
    </div>
  );
};

export default Error;
