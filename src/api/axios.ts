import axios from "axios";

export const api = axios.create({
  baseURL: "https://infinity-comics-library-mngr.onrender.com/api",
});
