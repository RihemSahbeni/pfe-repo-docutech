import axios from "axios";

// Set config defaults when creating the instance
const token = localStorage.getItem("token");
const Doc = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const addDoc = async (newDoc) => {
  try {
    
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    const d = await Doc.post("/api/Doc/create", newDoc,config);
    return d;
  } catch (err) {
    console.log(err);
  }
};

  export const AddProjecttoDoc = async (id, obj) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const edited = await Doc.put(`/api/Doc/addProject/${id}`, obj , config);
      return edited;
    } catch (err) {
      console.log(err);
    }
  };



export const deleteDoc = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const deleted = await Doc.delete(`/api/Doc/DELETE/${id}`,config);
    return deleted;
  } catch (err) {
    console.log(err);
  }
};
export const getDocById = async (id) => { // Accept Id as a parameter
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await Doc.get(`/api/doc/${id}`,config); // Use the Id to fetch a single from the API
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
  
};
export const getDoc = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await Doc.get("/api/docs/filter-by-project", config);
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};
export const getMyDoc = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await Doc.get("/api/docs/filter-by-user", config);
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};
export const getModel = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await Doc.get("/api/docs/filter-by-project-null", config);
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};



 
    

