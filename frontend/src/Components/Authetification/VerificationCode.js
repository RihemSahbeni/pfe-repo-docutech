import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Codeverif } from "../../Api/AuthApi";
import "../../File.css";

const VerificationCode = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  //Handle the user creation when click on the add button
  const handleCodeverif = async () => {
    //Second Methode with the user of the Toaster
    const res = await Codeverif({ email });
    console.log(res);
    if (res.data.status === "error") {
      setError(res.data.message);
      return;
    }

    navigate("/Createpass");
  };

  return (
    <main>
      <div class="container">
        <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div class="d-flex justify-content-center py-4">
                  <a
                    href="index.html"
                    class="logo d-flex align-items-center w-auto"
                  >
                    <img src="assets/img/looog.jpg" alt="" />
                    <span class="d-none d-lg-block">
                      <h4 class="mb-2">Bienvenue de retour!👋</h4>
                    </span>
                  </a>
                </div>
                <div class="card mb-3">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">
                        Mot de passe oublié ? 🔒
                      </h5>
                      <p class="text-center small">
                        Entrez votre adresse e-mail et nous vous enverrons des
                        instructions pour réinitialiser votre mot de passe.
                      </p>
                    </div>

                    <form class="row g-3 needs-validation" novalidate>
                      <div class="col-12">
                        <div class="d-flex justify-content-between">
                          <label for="yourUsername" class="form-label">
                            Email
                          </label>
                        </div>
                        <div class="input-group has-validation">
                          <span class="input-group-text" id="inputGroupPrepend">
                            @
                          </span>
                          <input
                            type="text"
                            name="username"
                            class="form-control"
                            id="yourUsername"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <div class="invalid-feedback">
                            Please enter your username.
                          </div>
                        </div>
                      </div>
                      {error && (
                        <div className="col-12">
                          <div className="alert alert-danger">{error}</div>
                        </div>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={() => handleCodeverif()}
                      >
                        Envoyer le lien de réinitialisation
                      </button>
                      <div class="col-12">
                        <p class="small mb-0">
                          <i class="bx bx-chevron-left scaleX-n1-rtl bx-sm"></i>
                          <a href="/login">
                            Retour à la page d'identification{" "}
                          </a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default VerificationCode;
