import axios from "axios";

// Set config defaults when creating the instance
const token = localStorage.getItem("token");
const History = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const addHistorique = async (newHistorique) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const h = await History.post("/api/history/create", newHistorique, config);
    return h;
  } catch (err) {
    console.log(err);
  }
};

/*export const updateHistory = async (id, obj) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const edited = await History.put(`/api/history/update/${id}`, obj, config);
    return edited;
  } catch (err) {
    console.log(err);
  }
};*/
/*export const deleteHistory = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const deleted = await History.delete(`/api/delete/history/${id}`, config);
    return deleted;
  } catch (err) {
    console.log(err);
  }
};*/
/*export const getHistoryById = async (id) => {
  // Accept a userId as a parameter
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await History.get(`/api/get/history/${id}`, config); // Use the userId to fetch a single user from the API
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};*/
export const getHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await History.get("/api/history/All", config);
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};
export const getHistoryByDoc = async (doc_id) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await History.get(
      `/api/history/filter-by-doc/${doc_id}`,
      config
    );
    return data;
  } catch (err) {
    if (err.message === "Network Error") {
      window.location.href = "/error";
    }
  }
};
