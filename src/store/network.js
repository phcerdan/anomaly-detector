import { createSlice } from "@reduxjs/toolkit";

// Global var
let uniqueRequestId = 1;

export const initialState = {
  requests: {
    /* id: { message, data, ... } */
  },
  pending: [],
  success: [],
  error: [],
  progress: "",
};

function now() {
  return Number(new Date());
}

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    createRequest: {
      reducer: (state, action) => {
        const id = action.payload.id[0];
        state.requests[id] = {
          message: action.payload.message,
          start: action.payload.start,
        };
        state.pending.push(id);
      },
      prepare: (message = "empty") => {
        // uniqueRequestId is a global variable
        const id = `${uniqueRequestId}`;
        uniqueRequestId += 1;
        return {
          payload: {
            id: id, // string: string
            message: message,
            start: now(),
          },
        };
      },
    },

    success: (state, action) => {
      if (!state.requests[action.payload.id]) {
        console.error("no request for", action.payload.id, action.payload.data);
      }
      state.requests[action.payload.id] = {
        message: state.requests[action.payload.id].message,
        data: action.payload.data,
        start: state.requests[action.payload.id].start,
        end: action.payload.end,
      };
      state.success.push(action.payload.id);
      state.pending.splice(
        state.pending.findIndex((id) => id === action.payload.id),
        1
      );
    },

    error: (state, action) => {
      if (!state.requests[action.payload.id]) {
        console.error("no request for", action.payload.id, action.payload.data);
      }
      state.requests[action.payload.id] = {
        message: state.requests[action.payload.id].message,
        data: action.payload.data,
        start: state.requests[action.payload.id].start,
        end: action.payload.end,
      };
      state.error.push(action.payload.id);
      console.error("network_error:", action.payload.data);
      state.pending.splice(
        state.pending.findIndex((id) => id === action.payload.id),
        1
      );
    },

    reset: () => {
      return initialState;
    },
  },
});

export const { createRequest, success, error, reset } = networkSlice.actions;
export default networkSlice.reducer;
