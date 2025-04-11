// @ts-check

import {
    currentColorSchemeStorage,
    systemSchemeStorage,
    preferredSchemeStorage,
} from "./theme.bundle.esm.js";
import { selectRefs, createFromHTML, generateId } from "./dom-scope.esm.js";

/**
 * Initializes a color scheme toggle button. The button will be created as a
 * fragment of HTML and appended to the body of the document.
 *
 * The button will be initialized to reflect the current color scheme, and will
 * be automatically updated when the user's preferred color scheme changes.
 *
 * If the theme is set to "auto", the button will be checked if the user's
 * preferred color scheme is dark, and unchecked if it is light. If the theme is
 * set to "dark" or "light", the button will be checked or unchecked accordingly.
 *
 * When the button is changed, the theme will be updated to "dark" or "light" as
 * appropriate.
 */
function initToggler() {
    let id = generateId();
    const fragment = createFromHTML(/* html */ `
        <div class="text-center mt-5 mb-5">
            <label class="form-label">Session Color Scheme Settings</label>
            <div class="d-flex justify-content-center mb-3">
                <span class=""><label class="form-check-label me-2" for="${id}">
                        <i class="bi bi-sun-fill me-1"></i>
                    </label>
                    <div class="form-check-inline form-switch me-0">
                        <input class="form-check-input" type="checkbox" role="switch" ref="switcher" :checked="darkmode_is_on"
                            id="${id}">
                    </div>
                    <label class="form-check-label" for="${id}">
                        <i class="bi bi-moon-stars-fill me-1">
                        </i>
                    </label>
                </span>
            </div>
        
        </div>
    `);

    const annotation = {
        switcher: HTMLInputElement,
    };

    const { switcher } = selectRefs(fragment, annotation);

    let darkmode_is_on = currentColorSchemeStorage.scheme === "dark";
    switcher.checked = darkmode_is_on;

    currentColorSchemeStorage.onSchemeChange((scheme) => {
        let darkmode_is_on = scheme === "dark";
        switcher.checked = darkmode_is_on;
    });

    switcher.addEventListener("change", () => {
        currentColorSchemeStorage.scheme = switcher.checked ? "dark" : "light";
    });

    document.body.appendChild(fragment);
}

/**
 * Deselects the specified list item by removing the "active" class and updating the
 * "aria-current" attribute to "false".
 *
 * @param {...HTMLElement} listItems - The list item to deselect.
 */
function deselectListItem(...listItems) {
    for (let listItem of listItems) {
        listItem.classList.remove("active");
        listItem.setAttribute("aria-current", "false");
    }
}

/**
 * Selects the given list item and deselects any previously selected list item.
 *
 * @param {HTMLElement} listItem - The list item to select.
 */
function selectListItem(listItem) {
    listItem.classList.add("active");
    listItem.setAttribute("aria-current", "true");
}

function initColorSchemeSelect() {
    let fragment = createFromHTML(/* html */ `
        <label class="form-label">Select Your Preferred Color Scheme (Persistent Color Scheme Settings)</label>
        <ul class="list-group">
         <li class="list-group-item" ref="modeSelectAuto">Auto</li>
         <li class="list-group-item" ref="modeSelectLight">Light</li>
         <li class="list-group-item" ref="modeSelectDark">Dark</li>
        </ul>
        
            `);

    const annotation = {
        modeSelectAuto: HTMLLIElement,
        modeSelectLight: HTMLLIElement,
        modeSelectDark: HTMLLIElement,
    };
    let { modeSelectAuto, modeSelectLight, modeSelectDark } = selectRefs(
        fragment,
        annotation
    );

    let preferredScheme = preferredSchemeStorage.scheme;
    if (preferredScheme === "auto") {
        selectListItem(modeSelectAuto);
    } else if (preferredScheme === "light") {
        selectListItem(modeSelectLight);
    } else if (preferredScheme === "dark") {
        selectListItem(modeSelectDark);
    }

    document.body.appendChild(fragment);

    modeSelectAuto.addEventListener("click", () => {
        preferredSchemeStorage.scheme = "auto";
        currentColorSchemeStorage.scheme = "auto";
        deselectListItem(modeSelectLight, modeSelectDark);
        selectListItem(modeSelectAuto);
    });

    modeSelectLight.addEventListener("click", () => {
        preferredSchemeStorage.scheme = "light";
        currentColorSchemeStorage.scheme = "light";
        deselectListItem(modeSelectAuto, modeSelectDark);
        selectListItem(modeSelectLight);
    });

    modeSelectDark.addEventListener("click", () => {
        preferredSchemeStorage.scheme = "dark";
        currentColorSchemeStorage.scheme = "dark";
        deselectListItem(modeSelectAuto, modeSelectLight);
        selectListItem(modeSelectDark);
    });
}

function initSystemColorSchemeInfo() {
    let fragment = createFromHTML(/* html */ `
        <div class="mt-4 text-center">
        <span>System Color Scheme:</span>
        <span ref="systemColorScheme"></span>
        </div>`);

    const annotation = {
        systemColorScheme: HTMLSpanElement,
    };

    let { systemColorScheme } = selectRefs(fragment, annotation);

    systemColorScheme.textContent = systemSchemeStorage.scheme;

    systemSchemeStorage.onSchemeChange((scheme) => {
        systemColorScheme.textContent = scheme;
    });

    document.body.appendChild(fragment);
}

function main() {
    initToggler();
    initColorSchemeSelect();
    initSystemColorSchemeInfo();
    initToggler();
}

main();
