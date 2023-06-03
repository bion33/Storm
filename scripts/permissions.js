/**
 * Opens the permissions dialogue when the button is clicked
 */

'use strict';

const nsPermission = {origins: ["*://www.nationstates.net/*"]};
const openDialog = document.querySelector('#open_dialog');

(async () => checkGranted())();
async function checkGranted() {
    if (await browser.permissions.contains(nsPermission)) {
        openDialog.disabled = true;
        openDialog.innerText = 'Permission granted!'
        window.close();
    }
}

openDialog.addEventListener('click', async () => {
    await browser.permissions.request(nsPermission);
    checkGranted();
});
