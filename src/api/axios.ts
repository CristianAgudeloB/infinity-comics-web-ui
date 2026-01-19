import axios from "axios";

export const api = axios.create({
  baseURL: "https://infinity-comics-library-mngr.vercel.app/api",
});
