import axios from "axios";

// Set config defaults when creating the instance
const token = localStorage.getItem("token");
const User = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

  export const addUser = async (newUser) => {
    try {
      const user = await User.post("/users/create", newUser);
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  export const updateUserStatus = async (id, newStatus) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const edited = await User.put(`/api/users/Inactive/${id}`, newStatus, config);
        return edited;
    } catch (error) {
        console.log(error.response); // Affiche la réponse d'erreur du serveur
        throw error; // Lève l'erreur pour qu'elle soit traitée ailleurs
    }
};
export const updateUserStatusActive = async (id, newStatus) => {
  try {
      const token = localStorage.getItem('token');
      const config = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      };
      const edited = await User.put(`/api/users/active/${id}`, newStatus, config);
      return edited;
  } catch (error) {
      console.log(error.response); // Affiche la réponse d'erreur du serveur
      throw error; // Lève l'erreur pour qu'elle soit traitée ailleurs
  }
};
export const editUsers = async (id, obj) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const edited = await User.put(`/api/users/update/${id}`, obj , config);
    return edited;
  } catch (err) {
    console.log(err);
  }
};

export const getUserById = async (id) => { // Accept a userId as a parameter
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await User.get(`/api/users/${id}`,config); // Use the userId to fetch a single user from the API
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
  
}; 
export const getUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await User.get("/api/all", config);
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};

export const modifyPassword = async (id,
  dataPassword) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await User.post(`/api/user/${id}/modify-password`, dataPassword, config); // Pass null as the second parameter for the request body
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};




 
    

