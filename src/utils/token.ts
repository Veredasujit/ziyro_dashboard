// src/utils/token.ts

let accessToken: string | null = null;
let refreshToken: string | null = null;
let session_id:string|null=null;


export const setAccessToken = (token: string) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};
 export const setRefreshToken = (token: string) =>{
  refreshToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("refreshToken", token);
  }
};
export const setSessionId = (token: string) =>{
  session_id = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("session_id", token);
  }
};

export const getAccessToken = () => {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken;
};
 export const getSessionId = () =>
  {
  if (session_id) return session_id;
  if (typeof window !== "undefined") {
    session_id = localStorage.getItem("session_id");
  }
  return session_id;
};
export const getRefreshToken = () =>
  {
  if (refreshToken) return refreshToken;
  if (typeof window !== "undefined") {
    refreshToken = localStorage.getItem("refreshToken");
  }
  return refreshToken;
};
// utils/token.ts
export const saveAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const saveRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

export const saveSessionId = (id: string) => {
  localStorage.setItem("session_id", id);
};


export const clearTokens = () => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("session_id");


  }
};



// export const setAccessToken = (token: string) =>
//   localStorage.setItem("accessToken", token);

// export const setRefreshToken = (token: string) =>
//   localStorage.setItem("refreshToken", token);

// export const getAccessToken = () =>
//   localStorage.getItem("accessToken");

// export const getRefreshToken = () =>
//   localStorage.getItem("refreshToken");

// export const clearTokens = () => {
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("refreshToken");
// };
