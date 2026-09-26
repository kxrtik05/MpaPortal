import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://mpaportalbackend-rhep.onrender.com";

const api = axios.create({
  baseURL,
});

export const getAttachmentUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;
  return `${baseURL}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
};

export default api;
