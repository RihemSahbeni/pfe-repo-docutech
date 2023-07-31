import  { useState,useEffect  } from "react";
import { modifyPassword ,getUserById} from "../../Api/UserApi";
import  "../../File.css";


const ModifierPassword = () => {
  const [oldPassword, setoldPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setnewPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error,setError]=useState(null);
  const [isSucces,setISucces]=useState(false);
  const [succesMsg,setSuccesMsg]=useState(null);

  
  
  // Récupérez l'id stocké dans le localStorage
  const id = localStorage.getItem('id');
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  
  useEffect(() => {
     // Si l'id existe, récupérez l'utilisateur correspondant
    if (id) {
      getUserById(id)
        .then(data => setUser(data))
        .catch(error => console.log(error));
    }
  }, []);
  const handleCreatepass = ( {ConfirmPassword, newPassword, oldPassword} ) => {
    const id = localStorage.getItem('id'); // Récupérer l'ID depuis le localStorage
  
    // Vérifier que id est défini
    if (id === null) {
      console.error("ID is not stored in localStorage");
      return;
    }
    const dataPassword={
      
      "oldPassword":oldPassword,
      "newPassword":newPassword,
      "confirmPassword":ConfirmPassword,
      
    }
    modifyPassword(id,dataPassword).then(async (reponse)=>{
      if(reponse.status=="error")
      {setError(reponse.message);
      setISucces(false);
      setSuccesMsg(null);


      }
      else{
        setError(null);
        setISucces(true);
        setSuccesMsg(reponse.message);

      } 
      })
 };
  
  

  return (

  <div class="tab-content pt-2">
  <div class="tab-pane fade pt-3 show active" id="profile-change-password">
    <h5 class="card-title"></h5> 


  <form class="row g-3 needs-validation" novalidate>

   

    <div class="col-8 mx-auto">
     <div class="d-flex justify-content-between"> <label for="yourPassword" class="form-label">Ancien mot de passe</label> 
              
              
              </div>
              <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend0"><i class="bi bi-file-earmark-lock text-primary"></i></span>
      <input type="password" name="password" class="form-control" id="yourPassword." required onChange={(e) => setoldPassword
        (e.target.value)}/>
      <div class="invalid-feedback"></div>
    </div></div>
    <div class="col-8 mx-auto">
  
  <div class="d-flex justify-content-between"><label for="yourPhoneNumber" class="form-label">Nouveau mot de passe</label></div>
  <div class="input-group has-validation">
          <span class="input-group-text" id="inputGroupPrepend1"><i class="bi bi-file-lock text-primary"></i></span>
                    <input type="password" name="password" class="form-control" id="yourPassword2" required onChange={(e) => setnewPassword(e.target.value)}/>
                    <div class="invalid-feedback"></div>
                  </div></div>
         
           <div class="col-12">
    
  </div>
    <div class="col-8 mx-auto">
  
    <div class="d-flex justify-content-between"><label for="yourPhoneNumber" class="form-label">Confirmez votre mot de passe</label></div>
    <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend2"><i class="bi bi-file-lock text-primary"></i></span>
                      <input type="password" name="password" class="form-control" id="yourPassword1" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                      <div class="invalid-feedback"></div>
                    </div></div>
                    {error&&
                    <div class="col-8 mx-auto">
                      <div className="alert alert-danger">
                        {error}
                      </div>
</div>}
{isSucces&&
                    <div class="col-8 mx-auto">
                      <div className="alert alert-success">
                        {succesMsg}
                      </div>
</div>}
                    <button type="button" className="btn btn-primary col-6 mx-auto" onClick={() => handleCreatepass({ oldPassword, newPassword, ConfirmPassword })}>Changer votre mot de passe</button>

             <div class="col-12">
      
    </div>
  </form>
</div></div>

       
       
     
  );
};

export default ModifierPassword;
