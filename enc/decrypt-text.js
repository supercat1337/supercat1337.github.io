// @ts-check

import {
    bufferToString,
    createCryptoKey,
    exportRawSecret,
    SingleFileDecryptor,
} from "./aes-gcm.esm.min.js";

const fileToDecryptInput = /** @type {HTMLInputElement} */ (
    document.getElementById("fileToDecryptInput")
);

const clearFileBtn = /** @type {HTMLButtonElement} */ (
    document.getElementById("clearFileBtn")
);
const secretInput = /** @type {HTMLInputElement} */ (
    document.getElementById("secretInput")
);
const downloadDecryptedBtn = /** @type {HTMLButtonElement} */ (
    document.getElementById("downloadDecryptedBtn")
);

const errorText = /** @type {HTMLDivElement} */ (
    document.getElementById("errorText")
);

const outputTextarea = /** @type {HTMLTextAreaElement} */ (
    document.getElementById("outputTextarea")
);

/**
 * Decrypts the given file using AES-GCM encryption with a given key.
 * @param {File} file - The file to decrypt.
 * @returns {Promise<void>} - A promise that resolves when the file is decrypted and saved.
 * @example
 * let file = new File(["Hello World!"], "example.txt");
 * await decryptFile(file);
 * console.log("File decrypted and saved successfully.");
 */
async function decryptFile(file) {
    let secret = secretInput.value; // Get the secret from the input field

    if (secret == "") {
        errorText.innerText = "Please enter a secret.";
        return;
    }

    errorText.innerText = ""; // Clear any previous error messages
    outputTextarea.value = ""; // Clear the output textarea

    try {
        let cryptoKey = await createCryptoKey(secret);
        let rawSecret = await exportRawSecret(cryptoKey);

        let sfd = new SingleFileDecryptor(file, rawSecret);

        let metaData = await sfd.decryptMetaData();
        if (!metaData) {
            console.error("Invalid file format.");
            return;
        }

        //console.log("Decrypted metadata:", metaData);

        let decryptedData = await sfd.decryptContent();

        //console.log("Decrypted data:", decryptedData);
        outputTextarea.value = bufferToString(decryptedData);
        sfd.terminate();
    } catch (e) {
        errorText.innerText = e.message;
        return;
    }
}

downloadDecryptedBtn.addEventListener("click", async (event) => {
    // Check if a file was selected
    // @ts-ignore
    if (fileToDecryptInput.files.length === 0) {
        console.error("No file selected.");
        return;
    }
    // Get the selected file
    // @ts-ignore
    let file = fileToDecryptInput.files[0];
    if (!file) {
        console.error("No file selected.");
        return;
    }

    // Decrypt the file
    await decryptFile(file);
});

clearFileBtn.addEventListener("click", (event) => {
    // Clear the file input field
    fileToDecryptInput.value = "";
    secretInput.value = ""; // Clear the secret input field
    errorText.innerText = ""; // Clear any previous error messages
    outputTextarea.value = ""; // Clear the output textarea
});
