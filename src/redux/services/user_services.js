import { apiCall } from "../../config/HTTP";

async function getUserStatement(data) {
    try {
        const response = await apiCall("POST", "user/userStatement", data);
        if (response) {
            return response;
          }
    } catch (error) {
      console.error("user Statement List", error);
      return Promise.reject(error);
    }
  }

  async function getUserBalance (data) {
    try {
      const user = await apiCall("POST", "user/userBalance", data);
  
      if (user) {
  
        localStorage.setItem('clientBalance', JSON.stringify(user.data.coins));
        localStorage.setItem('clientExposure', JSON.stringify(user.data.exposure));
        localStorage.setItem('clientProfitLoss', JSON.stringify(user.data.profitLoss));
        return user;
      }
    } catch (error) {
      console.error("Domain setting error:", error);
      return Promise.reject(error);
    }
  }

  async function userUpdate (data) {
    try {
      const user = await apiCall("PATCH", "user/userUpdate", data);
  
      if (user) {
        return user;
      }
    } catch (error) {
      console.error("user Update error:", error);
      return Promise.reject(error);
    }
  }
  async function getBetList (data) {
    try {
      const casinoListByCateogeory = await apiCall("POST", "sports/betsList", data);
      if (casinoListByCateogeory) {
        return casinoListByCateogeory;
      }
    } catch (error) {
      console.error("user Update error:", error);
      return Promise.reject(error);
    }
  }
  


  export const userServices = {
    getUserStatement,
    userUpdate,
    getBetList,
    getUserBalance

  }