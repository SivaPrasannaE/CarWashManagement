import axios from "axios";

export const clientService = async (method: string, endpoint: string, payload: any) => {
    try {

        const requestConfigurations = {
            method: method,
            url: endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            data: payload
        }

        const response = await axios(requestConfigurations);
        return response;

    } catch (error) {
        console.log(error);
    }
}