import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Client from "../protocols/Client";

const initialNetworkState = {
  client: null,
  busy: {
    count: 0,
    progress: 0,
  },
};

export const connectClient = createAsyncThunk(
  "connectClient",
  async (config, { dispatch, getState }) => {
    console.log("getState()", getState());
    const currentClient = getState().network.client;
    if (currentClient && currentClient.isConnected()) {
      currentClient.disconnect();
    }

    currentClient.setBusyCallback((count) => {
      console.log("dime arrrgo");
      const setCountAction = {
        type: "network/setBusyCount",
        payload: { count },
      };
      dispatch(setCountAction);
    });

    currentClient.updateBusy(+1);

    currentClient.setConnectionErrorCallback((type, httpReq) => {
      const message =
        (httpReq && httpReq.response && httpReq.response.error) ||
        `Connection ${type}`;
      console.error(message);
      console.log(httpReq);
    });

    console.log("About to connect client...");
    // connect returns a Promise
    return currentClient
      .connect(config)
      .then((validClient) => {
        console.log(validClient);
      })
      .catch((error) => {
        console.error("connectClient failed", error);
      });
  }
);

const networkSlice = createSlice({
  name: "network",
  initialState: initialNetworkState,
  reducers: {
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setBusyCount: (state, action) => {
      state.busy.count = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(connectClient.fulfilled, (state, action) => {})
  //     .addCase(connectClient.rejected, (state) => {});
  // },
});

export const { setClient, setBusyCount } = networkSlice.actions;
export default networkSlice.reducer;
