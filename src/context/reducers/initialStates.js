const BASE_EXPORT_FIELDS = {
    item: "",
    weight: 0,
    quantity: 1,
    total_weight: 0,
    visible: true,
}

const EXPORT_ARRAY = []
const BASE_ACTION = "CREATE"
const BASE_INDEX = null

export const initialState = {
    BASE_EXPORT_FIELDS,
    EXPORT_ARRAY,
    BASE_ACTION,
    BASE_INDEX
}
