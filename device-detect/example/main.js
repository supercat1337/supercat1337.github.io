// @ts-check

import {
    getAndroidDeviceNameFromUserAgent,
    getBrowser,
    getDeviceModel,
    getIosDeviceName,
    getLanguages,
    getOS,
    getTimeZone,
    isIPad,
    isIPhone,
    isIncognitoMode,
    isMobile,
    isPointerDevice,
    isSensorDevice,
    isWebview,
    isWindows11,
    getDeviceType,
} from "https://cdn.jsdelivr.net/npm/@supercat1337/device-detect/dist/device-detect.esm.min.js";

/**
 * Adds a new paragraph to the body of the document with the format:
 * <code>&lt;p&gt;{name}: {value}&lt;/p&gt;</code>
 * @param {string} name - The name of the value to add
 * @param {string | boolean} value - The value to add
 */
function addData(name, value) {
    const p = document.createElement("p");
    const elementName = document.createElement("strong");
    const elementValue = document.createElement("span");

    elementName.textContent = name;
    if (typeof value === "boolean") {
        elementValue.textContent = value ? "Yes" : "No";
    } else {
        elementValue.textContent = value;
    }

    elementValue.classList.add("ms-3");

    p.appendChild(elementName);
    p.appendChild(elementValue);

    document.body.appendChild(p);
}

function addSeparator(){
    const hr = document.createElement("hr");
    document.body.appendChild(hr);
}

async function main() {
    addData("User Agent", window.navigator.userAgent);
    addData("Screen Resolution", `${screen.width}x${screen.height}`);
    
    addSeparator();
    addData("Device Type", getDeviceType());
    addData("Device Model", await getDeviceModel());
    addData("OS", getOS());
    addData("Time Zone", getTimeZone());
    addData("Languages", JSON.stringify(getLanguages()));
    addData("Browser", getBrowser());
    addSeparator();
    
    addData("Android Device Name", getAndroidDeviceNameFromUserAgent());
    addData("Ios Device Name", getIosDeviceName());
    addData("Incognito Mode", await isIncognitoMode());
    addData("Mobile", isMobile());
    addData("Pointer Device", isPointerDevice());
    addData("Sensor Device", isSensorDevice());
    addData("Webview", isWebview());
    addData("Windows 11", await isWindows11());
    addData("IPad", isIPad());
    addData("IPhone", isIPhone());
}

await main();
