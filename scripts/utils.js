export const adjustUrlParams = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("card", param);
    window.history.replaceState(null, "", "?" + urlParams.toString());
}


