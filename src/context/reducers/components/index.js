import {actions} from "../../actions";

export const reducerBaseInfo = (state, action) => {
    switch (action.type) {
        case actions.SET_BASE_EXPORT_FIELDS:
            return {
                ...state,
                BASE_EXPORT_FIELDS: action.payload
            };
        case actions.SET_BASE_ACTION:
            return {
                ...state,
                BASE_ACTION: action.payload
            };
        case actions.SET_BASE_INDEX:
            return {
                ...state,
                BASE_INDEX: action.payload
            };
        case actions.ADD_EXPORT_DATA:
            return {
                ...state,
                EXPORT_ARRAY: [...state.EXPORT_ARRAY, action.payload]
            };
        case actions.SET_EXPORT_DATA:
            return {
                ...state,
                EXPORT_ARRAY: action.payload
            };
        default:
            return state;
    }
}
