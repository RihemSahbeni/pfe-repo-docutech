import axios from "axios";

// Set config defaults when creating the instance
const token = localStorage.getItem("token");
const Project = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const addProject = async (newProject) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const P = await Project.post("/api/project/create", newProject, config);
    return P;
  } catch (err) {
    console.log(err);
  }
};

export const AddusertoProject = async (id, obj) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const edited = await Project.put(
      `/api/project/UpdateUser/${id}`,
      obj,
      config
    );
    return edited;
  } catch (err) {
    console.log(err);
  }
};

export const updateProject = async (id, obj) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const edited = await Project.put(`/api/project/Update/${id}`, obj, config);
    return edited;
  } catch (err) {
    console.log(err);
  }
};
export const deleteproject = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const deleted = await Project.delete(`/api/project/delete/${id}`, config);
    return deleted;
  } catch (err) {
    console.log(err);
  }
};

export const deleteUserfromproject = async (projectId, userId) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const deleted = await Project.delete(
      `/api/project/RemoveUser/${projectId}/${userId}`,
      config
    );
    return deleted.data;
  } catch (err) {
    console.log(err);
  }
};

export const getProjectById = async (id) => {
  // Accept a userId as a parameter
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await Project.get(`/api/project/get/${id}`, config); // Use the userId to fetch a single user from the API
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};
export const getProject = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await Project.get("/api/project/all", config);
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};

export const getProjectForUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await Project.get("/api/project/allforuser", config);
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};
