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
 * Converts an HTML string to an DocumentFragment.
 *
 * @param {string} html - The HTML string
 * @returns {DocumentFragment} - The DocumentFragment created from the HTML string
 * @throws {Error} - If no element or multiple elements are found in the HTML string
 */
export function createFromHTML(html) {
    if (typeof html !== "string") {
        throw new Error("html must be a string");
    }

    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}

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

function addSeparator() {
    const hr = document.createElement("hr");
    document.body.appendChild(hr);
}

async function main() {
    let fragment = createFromHTML(/* html */ `
        <h1 class="display-4">Device Detect</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>User Agent</td>
                    <td>${window.navigator.userAgent}</td>
                </tr>
                <tr>
                    <td>Screen Resolution</td>
                    <td>${screen.width}x${screen.height}</td>
                </tr>
                <tr></tr>
                    <td>Device Type</td>
                    <td>${getDeviceType()}</td>
                </tr>
                <tr>
                    <td>Device Model</td>
                    <td>${await getDeviceModel()}</td>
                </tr>
                <tr>
                    <td>OS</td>
                    <td>${getOS()}</td>
                </tr>
                <tr>
                    <td>Time Zone</td>
                    <td>${getTimeZone()}</td>
                </tr>
                <tr>
                    <td>Languages</td>
                    <td>${JSON.stringify(getLanguages())}</td>
                </tr>
                <tr>
                    <td>Browser</td>
                    <td>${getBrowser()}</td>
                </tr>
                <tr>
                    <td>Incognito Mode</td>
                    <td>${(await isIncognitoMode()) ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>Pointer Device</td>
                    <td>${isPointerDevice() ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>Sensor Device</td>
                    <td>${isSensorDevice() ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>Webview</td>
                    <td>${isWebview() ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td colspan="100" class="text-center display-6">
                    Metadata
                    </td>
                </tr>
                <tr>
                    <td>Android Device Name</td>
                    <td>${getAndroidDeviceNameFromUserAgent()}</td>
                </tr>
                <tr>
                    <td>Ios Device Name</td>
                    <td>${getIosDeviceName()}</td>
                </tr>
                <tr></tr>
                    <td>Mobile</td>
                    <td>${isMobile() ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>Windows 11</td>
                    <td>${(await isWindows11()) ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>IPad</td>
                    <td>${isIPad() ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>IPhone</td>
                    <td>${isIPhone() ? "Yes" : "No"}</td>
                </tr>
            </tbody>
        </table>
`);

    document.body.appendChild(fragment);
}

await main();
