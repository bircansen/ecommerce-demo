import API from "./setupAxios";

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const updateProfile = (data) => API.put("/auth/profile", data);
export const updatePassword = (data) => API.put("/auth/password", data);
