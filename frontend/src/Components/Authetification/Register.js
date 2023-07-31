import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../Api/AuthApi";

const Register = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [error, setError] = useState(null);
  //Handle the user creation when click on the add button
  const handleRegister = async () => {
    // check if firstname is empty or contains only spaces
    if (!firstname.trim()) {
      setFirstnameError("Le prénom est requis");
      return;
    }
    // Vérifier si le prénom contient des caractères spéciaux ou des chiffres
    if (!/^[a-zA-Z]+$/.test(firstname)) {
      setFirstnameError("Le prénom ne doit contenir que des lettres");
      return;
    }
    // Vérifier si le prénom contient moins de 2 caractères
    if (firstname.length < 2) {
      setFirstnameError("Le prénom doit comporter au moins 2 caractères");
      return;
    }
    // Effacer le message d'erreur du prénom s'il passe la validation
    setFirstnameError("");
    
    // Vérifier si le nom de famille est vide ou ne contient que des espaces
    if (!lastname.trim()) {
      setLastnameError("Le nom de famille est requis");
      return;
    }
    // Vérifier si le nom de famille contient des caractères spéciaux ou des chiffres
    if (!/^[a-zA-Z]+$/.test(lastname)) {
      setLastnameError("Le nom de famille ne doit contenir que des lettres");
      return;
    }
    // Vérifier si le nom de famille contient moins de 2 caractères
    if (lastname.length < 2) {
      setLastnameError("Le nom de famille doit comporter au moins 2 caractères");
      return;
    }
    // Effacer le message d'erreur du nom de famille s'il passe la validation
    setLastnameError("");
    
    // Vérifier si l'e-mail est vide ou ne contient que des espaces
    if (!email.trim()) {
      setEmailError("L'adresse e-mail est requise");
      return;
    }
    // Vérifier si l'e-mail est valide
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("L'adresse e-mail n'est pas valide");
      return;
    }
    // Effacer le message d'erreur de l'e-mail s'il passe la validation
    setEmailError("");
    
    // Vérifier si le mot de passe est vide ou ne contient que des espaces
    if (!password.trim()) {
      setPasswordError("Le mot de passe est requis");
      return;
    }
    // Vérifier si le mot de passe contient moins de 6 caractères
    if (password.length < 6) {
      setPasswordError("Le mot de passe doit comporter au moins 6 caractères");
      return;
    }
    // Effacer le message d'erreur du mot de passe s'il passe la validation
    setPasswordError("");
    
    // Vérifier si le numéro de téléphone est vide ou ne contient que des espaces
    if (!phoneNumber.trim()) {
      setPhoneNumberError("Le numéro de téléphone est requis");
      return;
    }
    // Vérifier si le numéro de téléphone est valide
    if (!/^[0-9]+$/.test(phoneNumber)) {
      setPhoneNumberError("Le numéro de téléphone ne doit contenir que des chiffres");
      return;
    }
    // Vérifier si le numéro de téléphone contient moins de 8 chiffres
    if (phoneNumber.length < 8) {
      setPhoneNumberError("Le numéro de téléphone doit comporter au moins 8 chiffres");
      return;
    }
    
    // clear the phone number error message if it passes validation
    setPhoneNumberError("");

    const res = await register({
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
    });
    if (res.data.status === "error") {
      setError(res.data.message);
      return;
    }

    console.log(res);
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
                      <h4 class="mb-2">Bienvenue ! 👋</h4>
                    </span>
                  </a>
                </div>
                <div class="card mb-3">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">
                        Créer un compte
                      </h5>
                      <p class="text-center small">
                        Entrez vos coordonnées personnelles pour créer un
                        compte.
                      </p>
                    </div>
                    <form class="row g-3 needs-validation" novalidate>
                      <div class="col-12">
                        <label for="yourName" class="form-label">
                          Nom
                        </label>
                        <div class="input-group has-validation">
                          <span class="input-group-text" id="inputGroupPrepend">
                            <i class="bi bi-person"></i>
                          </span>
                          <input
                            type="text"
                            name="name"
                            class="form-control"
                            id="yourName"
                            required
                            onChange={(e) => setFirstname(e.target.value)}
                          />
                          {firstnameError && (
                            <div className="error">{firstnameError}</div>
                          )}
                          <div class="invalid-feedback">
                            S'il vous plaît, entrez votre nom !{" "}
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <label for="yourUsername" class="form-label">
                          Prénom
                        </label>
                        <div class="input-group has-validation">
                          <span class="input-group-text" id="inputGroupPrepend">
                            <i class="bi bi-person-fill"></i>
                          </span>
                          <input
                            type="text"
                            name="username"
                            class="form-control"
                            id="yourUsername"
                            required
                            onChange={(e) => setLastname(e.target.value)}
                          />
                          {lastnameError && (
                            <div className="error">{lastnameError}</div>
                          )}
                          <div class="invalid-feedback">
                            S'il vous plaît, entrez votre prénom
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <label for="yourEmail" class="form-label">
                          {" "}
                          Email
                        </label>
                        <div class="input-group has-validation">
                          <span class="input-group-text" id="inputGroupPrepend">
                            @
                          </span>
                          <input
                            type="email"
                            name="email"
                            class="form-control"
                            id="yourEmail"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          {emailError && (
                            <div className="error">{emailError}</div>
                          )}
                          <div class="invalid-feedback">
                            Veuillez saisir une adresse e-mail valide !
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <label for="yourPhoneNumber" class="form-label">
                          Numéro de téléphone
                        </label>
                        <div class="input-group has-validation">
                          <span class="input-group-text" id="inputGroupPrepend">
                            <i class="bi bi-telephone-fill"></i>
                          </span>
                          <input
                            type="PhoneNumber"
                            name="PhoneNumber"
                            class="form-control"
                            id="yourPhoneNumber"
                            required
                            onChange={(e) => setphoneNumber(e.target.value)}
                          />
                          {phoneNumberError && (
                            <div className="error">{phoneNumberError}</div>
                          )}
                          <div class="invalid-feedback">
                            Veuillez saisir votre numéro de téléphone !
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <label for="yourPassword" class="form-label">
                          Mot de passe
                        </label>
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
                          {passwordError && (
                            <div className="error">{passwordError}</div>
                          )}
                          <div class="invalid-feedback">
                            Veuillez saisir votre mot de passe !
                          </div>
                        </div>
                      </div>
                    </form>
                    {error && (
                      <div className="my-3 alert alert-danger">{error}</div>
                    )}
                    <div class="text-center">
                      <br></br>
                      <button
                        type="submit"
                        class="btn btn-primary"
                        onClick={() => handleRegister()}
                        variant="primary"
                      >
                        Valider
                      </button>
                    </div>
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

export default Register;
