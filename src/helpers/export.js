export const JsonExport = (state) => {
    const exportObj = {
        data: [
            ...state.EXPORT_ARRAY
        ]
    }

    try {
        const fileName = "packliste"
        const jsonData = JSON.stringify(exportObj, null, 2)
        const blob = new Blob([jsonData],{type:'application/json'});
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.log(e)
    }
}
