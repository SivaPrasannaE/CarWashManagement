import { clientService } from "../service/client";


export const getMembershipData = async () => {
    const response = await clientService("GET", "http://localhost:8000/form", {}) 
    return { status: response?.status, data: response?.data };

}

export const getCarModels= async () => {
    const response = await clientService("GET", "http://localhost:8000/form" , {})
    // console.log(response.data,"CarMOdels");
    return { status: response?.status, data: response?.data };
}

export const getLocationData= async (id:string) => {
    const response = await clientService("POST", "http://localhost:8000/location", {"membership":id})
    return { status: response?.status, data: response?.data };
}

export const getInitialGridData= async (initialPayload : any) => {
    console.log(initialPayload,"payload")
    const response = await clientService("POST", "http://localhost:8000/postInitialGridData", initialPayload)
    // console.log(response.data,"res");
    return { status: response?.status, data: response?.data};
    
}

export const postFormDataApi = async (formData: any) => {
    const response = await clientService("POST", "http://localhost:8000/formData", formData)
    return { status: response?.status, data: response?.data };
}
