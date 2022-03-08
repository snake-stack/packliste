import {createContext, useReducer} from "react";
import {initialState} from "./reducers/initialStates";
import {
    reducerBaseInfo,
} from "./reducers/components";

const Context = createContext({});

const combineReducers = (...reducers) => (state, action) => {
    for (let i = 0; i < reducers.length; i++) state = reducers[i](state, action);
    return state;
};

const ContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(
        combineReducers(
            reducerBaseInfo,
        ), initialState);
    const value = {state, dispatch};

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export {Context, ContextProvider};
