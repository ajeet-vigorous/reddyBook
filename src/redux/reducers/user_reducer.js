import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userServices } from "../services/user_services";


const initialState = {

};

export const getAccountStatement = createAsyncThunk(
  "user/getAccountStatement",
  async (reqData, { rejectWithValue }) => {
    try {
      const userMatchList = await userServices.getUserStatement(reqData);
      return userMatchList;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBetListfunc = createAsyncThunk(
  "sports/betsList",
  async (payload, { rejectWithValue }) => {
    try {
      const casinoListByCateogeory = await userServices.getBetList(payload);

      return casinoListByCateogeory;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);


export const getClientExposure = createAsyncThunk(
  "sports/getClientExposure",
  async (payload, { rejectWithValue }) => {
    try {
      const casinoListByCateogeory = await userServices.getBetList(payload);

      return casinoListByCateogeory;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);


export const userUpdate = createAsyncThunk(
  "user/userUpdate",
  async (payload, { rejectWithValue }) => {
    try {
      const user = await userServices.userUpdate(payload);

      return user;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);

export const getUserBalance = createAsyncThunk(
  "user/getUserBalance",
  async (payload, { rejectWithValue }) => {
    try {
      const user = await userServices.getUserBalance(payload);

      return user;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);

export const getCasinoListByCateogeory = createAsyncThunk(
  "sport/getCasinoListByCateogeory",
  async (payload, { rejectWithValue }) => {
    try {
      const casinoListByCateogeory = await userServices.getCasinoListByCateogeory(payload);

      return casinoListByCateogeory;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);


export const getInternationalGroupCasinoList = createAsyncThunk(
  "websit/getInternationalGroupCasinoList",
  async (payload, { rejectWithValue }) => {
    try {
      const cosinoGroupList = await userServices.getInternationalGroupCasinoList(payload);

      return cosinoGroupList;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);

export const getMatchList = createAsyncThunk(
  "user/getMatchList",
  async (payload, { rejectWithValue }) => {
    try {
      const user = await userServices.getMatchList(payload);


      return user;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);

export const getDomainSettingData = createAsyncThunk(
  "user/getDomainSettingData",
  async (payload, { rejectWithValue }) => {
    try {
      const user = await userServices.getDomainSettingData(payload);

      return user;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);

export const getCasinoListByProviderName = createAsyncThunk(
  "websit/getCasinoListByProviderName",
  async (payload, { rejectWithValue }) => {
    try {
      const cosinoGroupList = await userServices.getCasinoListByProviderName(payload);

      return cosinoGroupList;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccountStatement.pending, (state) => {
        state.loading = true;
        state.accountStatement = [];
      })
      .addCase(getAccountStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.accountStatement = action.payload?.data;
      })
      .addCase(getAccountStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.accountStatement = [];
      })

      .addCase(userUpdate.pending, (state) => {
        state.loading = true;
        state.userUpdate = [];
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.userUpdate = action.payload?.data;
      })
      .addCase(userUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userUpdate = [];
      })

      .addCase(getBetListfunc.pending, (state) => {
        state.loading = true;
        state.betList = [];
      })
      .addCase(getBetListfunc.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.betList = action.payload?.data;
      })
      .addCase(getBetListfunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.betList = [];
      })

      .addCase(getClientExposure.pending, (state) => {
        state.loading = true;
        state.exposureData = [];
      })
      .addCase(getClientExposure.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.exposureData = action?.payload?.data;


      })
      .addCase(getClientExposure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.exposureData = [];
      })

      .addCase(getUserBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.userBalance = action.payload?.data;
      })
      .addCase(getUserBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getCasinoListByCateogeory
      .addCase(getCasinoListByCateogeory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCasinoListByCateogeory.fulfilled, (state, action) => {
        state.loading = false;
        state.getCasinoListByCateogeoryData = action.payload?.data;
      })
      .addCase(getCasinoListByCateogeory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // casino international List
      .addCase(getInternationalGroupCasinoList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInternationalGroupCasinoList.fulfilled, (state, action) => {
        state.loading = false;
        state.getInternationalGroupCasinoListData = action.payload?.data;
      })
      .addCase(getInternationalGroupCasinoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMatchList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMatchList.fulfilled, (state, action) => {
        state.loading = false;
        state.matchList = action.payload?.data ? action.payload?.data : [];
      })
      .addCase(getMatchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDomainSettingData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDomainSettingData.fulfilled, (state, action) => {
        state.loading = false;
        state.userDomainData = action.payload?.data;
      })
      .addCase(getDomainSettingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // providers list according to provider
      .addCase(getCasinoListByProviderName.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCasinoListByProviderName.fulfilled, (state, action) => {
        state.loading = false;
        state.getCasinoListByProviderNameData = action.payload?.data;
      })
      .addCase(getCasinoListByProviderName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
