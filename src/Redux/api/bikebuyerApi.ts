import { apiSlice } from "../apiSlice";

export interface BuyRequestPayload {
  vehicleId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  offeredPrice?: number;
  paymentMethod: string;
  testRideRequired?: boolean;
  preferredContactTime?: string;
  message?: string;
}

export interface Buyer {
  userId: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
}

export interface Vehicle {
  vehicleId: string;
  brand: string;
  model: string;
  year?: number;
  price?: number;
  images?: string[];
  vehicleTitle:string;
  modalNumber:string;
  version:string;
  vehicleColor:string;
  manufacturingYear:string;
  fuelType:string;
  kmsDriven:string;
  ownerType: string;
  lastServiceDate: string;
  sellingPrice: number;

}

export interface BuyRequest {
  requestId: string;
  buyerId: string;
  vehicleId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  offeredPrice?: number;
  paymentMethod: string;
  testRideRequired?: boolean;
  preferredContactTime?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  vehicle?: Vehicle;
  buyer?: Buyer;
  updatedAt:string;
}

export interface BuyRequestsResponse {
  success: boolean;
  requests: BuyRequest[];
  totalRequests?: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export const bikeBuyRequestApi =
  apiSlice.injectEndpoints({
    endpoints: (builder) => ({
     

     

      

      // Admin - All Requests
      getAllVehicleRequests:
        builder.query<
          BuyRequestsResponse,
          void
        >({
          query: () => ({
            url: "/buy-bike/all-requests",
            method: "GET",
          }),
        }),

      // Update Status
      updateRequestStatus:
        builder.mutation<
          ApiResponse,
          {
            requestId: string;
            status:
              | "pending"
              | "approved"
              | "rejected";
          }
        >({
          query: ({
            requestId,
            status,
          }) => ({
            url: `/buy-bike/status/${requestId}`,
            method: "PUT",
            data: { status },
          }),
        }),
    }),
  });

export const {
  useGetAllVehicleRequestsQuery,
  useUpdateRequestStatusMutation,
} = bikeBuyRequestApi;