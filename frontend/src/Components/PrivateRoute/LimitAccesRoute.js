
import {  Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; 

const LimitAccesRoute = ({ path, element, children}) => {
  const token = localStorage.getItem('token');
  if (token) {
   const decoded = jwt_decode(token);
  localStorage.setItem("decoded", decoded);
  const userRole = decoded.roles[0]; // extraire le rôle de l'utilisateur
 // stocker le rôle dans le Local Storage
localStorage.setItem('userRole', userRole);
console.log(decoded); 
  
  if (userRole === 'Admin') {
    return children;
    } else {
    // Rediriger l'utilisateur vers une page d'erreur d'autorisation
    return <Navigate to="/dashboard" />;
  };
} else {
  // Rediriger l'utilisateur vers la page de connexion s'il n'a pas de jeton
  return <Navigate to="/login" />;
}
}

export default LimitAccesRoute;
