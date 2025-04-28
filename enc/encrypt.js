// @ts-check

import {
    createCryptoKey,
    exportSecret,
    SingleFileEncryptor,
    exportRawSecret,
} from "./aes-gcm.esm.min.js";

const fileToEncryptInput = /** @type {HTMLInputElement} */ (
    document.getElementById("fileToEncryptInput")
);
const clearFileBtn = /** @type {HTMLButtonElement} */ (
    document.getElementById("clearFileBtn")
);
const secretInput = /** @type {HTMLInputElement} */ (
    document.getElementById("secretInput")
);
const downloadEncryptedBtn = /** @type {HTMLButtonElement} */ (
    document.getElementById("downloadEncryptedBtn")
);

const errorText = /** @type {HTMLDivElement} */ (
    document.getElementById("errorText")
);

/**
 * Encrypts a given file using AES-GCM encryption with a given key.
 * @param {File} file - The file to encrypt.
 * @returns {Promise<void>} - A promise that resolves when the file has been encrypted and saved.
 */
async function encryptFile(file) {
    secretInput.value = ""; // Clear the secret input field
    errorText.innerText = ""; // Clear any previous error messages

    try {
        const cryptoKey = await createCryptoKey();
        const secret = await exportSecret(cryptoKey);
        const rawSecret = await exportRawSecret(cryptoKey);

        let sfe = new SingleFileEncryptor(file, rawSecret);

        let encryptedData = await sfe.encrypt();
        //console.log("Encrypted data:", encryptedData);
        let blob = new Blob([encryptedData], {
            type: "application/octet-stream",
        });
        let encryptedFile = new File([blob], file.name + ".enc", {
            type: "application/octet-stream",
        });
        var blobUrl = URL.createObjectURL(encryptedFile);
        var a = document.createElement("a");
        a.href = blobUrl;
        a.classList.add("d-none");
        a.download = file.name + ".enc";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl); // Clean up the blob URL
        console.log("File encrypted and saved successfully.");
        sfe.terminate();

        secretInput.value = secret; // Set the secret input field to the generated secret
    } catch (error) {
        console.error(error);
        errorText.innerText = error.message;
        return;
    }
}

downloadEncryptedBtn.addEventListener("click", async (event) => {
    // Check if a file was selected
    // @ts-ignore
    if (fileToEncryptInput.files.length === 0) {
        console.error("No file selected.");
        return;
    }
    // Get the selected file
    // @ts-ignore
    let file = fileToEncryptInput.files[0];
    if (!file) {
        console.error("No file selected.");
        return;
    }

    await encryptFile(file);
});

clearFileBtn.addEventListener("click", (event) => {
    // Clear the file input field
    fileToEncryptInput.value = "";
    secretInput.value = ""; // Clear the secret input field
    errorText.innerText = ""; // Clear any previous error messages
});
