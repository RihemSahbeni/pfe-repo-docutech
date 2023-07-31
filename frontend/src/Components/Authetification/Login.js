import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { login } from "../../Api/AuthApi";
import { useDispatch } from "react-redux";
import "../../File.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const handleLogin = async () => {
    if (email === "") {
      console.log("Veuillez fournir une adresse e-mail.");
      setErrorMessage("Veuillez fournir une adresse e-mail.");
      return;
      }
      
      if (password === "") {
        console.log("Veuillez fournir un mot de passe.");
        setErrorMessage("Veuillez fournir un mot de passe.");
        return;
      }
      
    console.log("Logging in with:", { email, password });

    // Attempt to log in with provided email and password
    var res = await login({ email, password });
    console.log("Login response:", res);
    // Set response message
    setResponseMessage(res.data.message);
    const status = res.data.status;
    const message = res.data.message;
    if (status === "Inactive") {
      console.log("Votre compte a été désactivé.");
      setErrorMessage("Votre compte a été désactivé.");
      return;
    } else if (status === "error") {
      setErrorMessage(message);
      return;
    }

    const token = res.data.token;
    const firstname = res.data.firstname;
    const lastname = res.data.lastname;
    const id = res.data.id;

    localStorage.setItem("token", token);

    // Pour stocker les infos d'utilisateur dans la session
    localStorage.setItem("email", email);
    localStorage.setItem("status", status);
    localStorage.setItem("firstname", firstname);
    localStorage.setItem("lastname", lastname);
    localStorage.setItem("id", id);

    //Navigate to the dashboard
    navigate("/dashboard");
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
                      <h4 class="mb-2">Bienvenue de retour ! 👋</h4>
                    </span>
                  </a>
                </div>
                <div class="card mb-3">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">
                        Connectez-vous à votre compte
                      </h5>
                      <p class="text-center small">
                        Veuillez saisir vos identifiants
                      </p>
                    </div>

                    <form class="row g-3 needs-validation" novalidate>
                      <div class="col-12">
                        <div class="d-flex justify-content-between">
                          <label for="youremail" class="form-label">
                            email
                          </label>
                        </div>
                        <div class="input-group has-validation">
                          <span class="input-group-text" id="inputGroupPrepend">
                            @
                          </span>
                          <input
                            type="text"
                            name="email"
                            class="form-control"
                            id="youremail"
                            required
                            onChange={(e) => setemail(e.target.value)}
                          />
                          <div class="invalid-feedback">
                            Veuillez saisir votre adresse e-mail.
                          </div>
                          {emailError && (
                            <div className="error">{emailError}</div>
                          )}
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="d-flex justify-content-between">
                          {" "}
                          <label for="yourPassword" class="form-label">
                            Mot de passe{" "}
                          </label>
                          <a href="/VerificationCode">
                            <small>Mot de passe oublié ?</small>
                          </a>
                        </div>
                        <div class="input-group has-validation">
                          <span class="input-group-text" id="inputGroupPrepend">
                            <i class="bi bi-file-earmark-lock"></i>
                          </span>
                          <input
                            type="password"
                            name="password"
                            class="form-control"
                            id="yourPassword"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <div class="invalid-feedback">
                            Veuillez saisir votre mot de passe!
                          </div>
                          {passwordError && (
                            <div className="error">{passwordError}</div>
                          )}
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            name="remember"
                            value="true"
                            id="rememberMe"
                          />
                          <label class="form-check-label" for="rememberMe">
                            Se souvenir de moi
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={() => handleLogin()}
                      >
                        Se connecter
                      </button>

                      <div class="col-12">
                        <p class="small mb-0">
                          Vous n'avez pas de compte ?{" "}
                          <a href="/register">Créer un compte</a>
                        </p>
                      </div>
                      <div>
                        {ErrorMessage && (
                          <div className="error alert alert-danger">
                            {" "}
                            <i class="bi bi-exclamation-octagon me-1"></i>
                            {ErrorMessage}
                          </div>
                        )}
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

export default Login;
