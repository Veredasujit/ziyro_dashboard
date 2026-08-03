
 export interface UserFull {
  id: string;                 // user_id
  userPublicId: string;       // user_public_id
  name: string;           // user_name
  email: string;
  phoneNumber: string;        // phone_number

   role: "admin",


  companyName?: string;        // company_name
  natureOfCompany?: string;    // nature_of_company
  address?: string;
  

  
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

 export interface  RegisterRequest {
  id: string;                 // user_id
  userPublicId: string;       // user_public_id
  name: string;           // user_name
  email: string;
  phoneNumber: string;        // phone_number

  role: "admin",


  
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
 }
//  interface UserIn{
//   role: "user"|"service_partner",
// }

type Role = "admin" | "user" | "service_partner";


export interface User {
  adminId: string;
  fullName: string;
  email: string;
  mobileNumber:string;
  role:Role;
  status: "active" | "inactive" | "blocked";
  isVerified: boolean;
  lastLogin?: string;
}

 export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  session_id: string|null;
  isAuthenticated: boolean;
  loading: boolean;
}

