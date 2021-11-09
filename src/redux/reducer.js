import { DECREMENT, INCREMENT, SET } from "./action";

export const initialState = { count: 0 };
export const reducer = (state = initialState, action) => {
    console.log(state,' action ',action);
  // eslint-disable-next-line default-case
  switch (state.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    case SET:
      return { count: parseInt(action.count, 10) };
  }
  return state;
};
