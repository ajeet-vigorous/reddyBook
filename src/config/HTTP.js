
import axios from "axios";
import { domainName } from "./Auth";
import settings from "../domainConfig";
import CryptoJS from "crypto-js";



export const baseUrl = {
    BACKEND_URL: settings?.apiurl,
    SOCKET_URL: settings?.SOCKET_URL,

};

export function authHeader() {
    const user = JSON.parse(localStorage.getItem(`user_info_${domainName}`) || 'null');
    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

export const apiCall = async (method, path, payload) => {
    try {
        const response = await axios({
            method,
            url: baseUrl.BACKEND_URL + path,
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            },
        });

        if (response && response.data && response.data.dataEncrupt && response.data.dataEncrupt == true) {
            if (response.data) {
                let encruptedData = response.data.data
                const bytes = CryptoJS.AES.decrypt(encruptedData, import.meta.env.VITE_SECRET_KEY
                );
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                if (decryptedData && decryptedData != null && decryptedData != "") {
                    response.data.data = JSON.parse(decryptedData)
                }
            }
        }

        return response.data;
    } catch (error) {
        if (Number(error?.response?.data?.code) === 3 || Number(error?.response?.status) === 401) {
            localStorage.clear();
            window.location.href = '/dashboard';
        } else if (error.response) {
            throw error.response;
        } else if (error.request) {
            throw new Error('No response received from the server');
        } else {
            console.error(error, "Error occurred during request setup");
            throw new Error(error.message);
        }
    }
};
