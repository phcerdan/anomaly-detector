import networkReducer, {
  initialState,
  createRequest,
  success,
  error,
  reset,
} from "./network";

describe("network", () => {
  // date to compare future dates
  const now = Number(new Date());

  it("networkReducer should return the initial state if action is empty", () => {
    expect(networkReducer(undefined, {})).toEqual(initialState);
  });

  describe("createRequest", () => {
    it("action without parameters (using default)", () => {
      const defaultMessage = "empty";
      const action = createRequest();
      expect(action.payload.message).toEqual(defaultMessage);
      expect(action.payload.start).toBeGreaterThanOrEqual(now);
    });
    it("specifying parameters: message", () => {
      const message = "createRequest message";
      const action = createRequest(message);
      const expectedAction = {
        type: createRequest.toString(),
        payload: {
          id: "2",
          message: message,
          start: "whatever",
        },
      };

      expect(action.payload.id).toEqual(expectedAction.payload.id);
      expect(action.payload.message).toEqual(expectedAction.payload.message);
      expect(action.payload.start).toBeGreaterThanOrEqual(now);
    });
    it("reducer modify state with action", () => {
      const afterState = networkReducer(
        initialState,
        createRequest("createRequest message")
      );

      const whateverId = "1111";
      const whateverDate = 999;
      const expectedState = {
        requests: {
          [whateverId]: {
            message: "createRequest message",
            start: whateverDate,
          },
        },
        pending: [whateverId],
        success: [],
        error: [],
        progress: "",
      };

      expect(Object.values(afterState.requests).message).toEqual(
        Object.values(expectedState.requests).message
      );
    });
  });

  describe("success", () => {
    const payload = {
      id: "4",
      data: "whatever",
      end: now,
    };
    it("action", () => {
      const action = success(payload);
      expect(action.payload).toEqual(payload);
    });
    it("reducer modify state with action", () => {
      const existingState = Object.assign({}, initialState, {
        requests: {
          4: {
            message: "An existing message after creation",
            start: now,
          },
        },
        pending: ["4"],
      });
      const afterState = networkReducer(existingState, success(payload));
      const expectedAfterState = {
        requests: {
          4: {
            message: "An existing message after creation",
            data: "whatever", // add data
            start: now,
            end: now, // add end date (comparison might fail here?)
          },
        },
        pending: [], // delete id ("4") here
        success: ["4"], // append id ("4") here
        error: [],
        progress: "",
      };
      expect(afterState).toEqual(expectedAfterState);
    });
  });
  describe("error", () => {
    const payload = {
      id: "4",
      data: "whatever",
      end: now,
    };
    it("action", () => {
      const action = error(payload);
      expect(action.payload).toEqual(payload);
    });
    it("reducer modify state with action", () => {
      const existingState = Object.assign({}, initialState, {
        requests: {
          4: {
            message: "An existing message after creation",
            start: now,
          },
        },
        pending: ["4"],
      });
      // We don't pollute the test with console.error triggered here
      const originalConsole = console.error;
      console.error = jest.fn();
      const afterState = networkReducer(existingState, error(payload));
      expect(console.error).toHaveBeenCalled();
      console.error = originalConsole;
      const expectedAfterState = {
        requests: {
          4: {
            message: "An existing message after creation",
            data: "whatever", // add data
            start: now,
            end: now, // add end date (comparison might fail here?)
          },
        },
        pending: [], // delete id ("4") here
        success: [], // append id ("4") here
        error: ["4"],
        progress: "",
      };
      expect(afterState).toEqual(expectedAfterState);
    });
  });
  describe("reset", () => {
    it("action", () => {
      const action = reset();
      expect(action.type).toEqual("network/reset");
    });
    it("reducer modify state with action", () => {
      const existingState = Object.assign({}, initialState, {
        requests: {
          4: {
            message: "An existing message after creation",
            start: now,
          },
        },
        pending: ["4"],
      });
      const afterState = networkReducer(existingState, reset());
      expect(afterState).toEqual(initialState);
    });
  });
});
