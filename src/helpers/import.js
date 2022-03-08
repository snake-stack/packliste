export const JsonImport = (rawData, state, dispatch) => {
    if (rawData.size <= 0) {
        return
    }

    try {
        let fileReader = new FileReader();
        fileReader.readAsText(rawData, "UTF-8");
        fileReader.onload = e => {
            const data = e.target.result
            let parsedData = JSON.parse(data)

            if (parsedData === null || typeof parsedData === "undefined") {
                return
            }

            if (!parsedData.hasOwnProperty('data')) {
                return
            }

            dispatch({
                type: "SET_EXPORT_DATA",
                payload: parsedData.data
            })
        };
    } catch (err) {
        console.log(err)
    }
}
