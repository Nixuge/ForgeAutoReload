// content.js
console.log("Page has loaded!");
// Your code to run after the page loads goes here

// 5s
const DELAY_BETWEEN_REQUESTS = 5000;

const AUTO_START_REFRESH = true;

/**
 * @typedef {Object} TitleAndTagsResult
 * @property {HTMLElement} titled - The title div element.
 * @property {HTMLElement} tagd - The tags div element.
 */

/**
 * Retrieves the title and tags div elements from the document.
 *
 * @param {Document} document - The document object to search within.
 * @returns {TitleAndTagsResult} An object containing the titled and tagd elements.
 */
function getTitleAndTagsDiv(doc) {
    let titled = null;
    let tagd = null;
    doc.getElementsByClassName("stack")[0].querySelectorAll('div.title').forEach(div => {
        if (div.textContent.trim() === "Tags") {
            titled = div;
            const nextSibling = div.nextElementSibling;
            if (nextSibling && nextSibling.tagName.toLowerCase() === 'div') {
                tagd = nextSibling;
            }
            return;
      }
    });
    return { titled, tagd };
}

// =====Load=====
const { titled: originalTitleDiv, tagd: originalTagsDiv } = getTitleAndTagsDiv(document);


if (originalTitleDiv == null || originalTagsDiv == null) {
    throw Error("Could not find proper divs.")
}

// make refresh/reload button divs
// let reloading = false;
const containerDiv = document.createElement('div');
const refreshButton = document.createElement('button');
refreshButton.textContent = 'Refresh';

const reloadingText = document.createElement('span');
reloadingText.textContent = 'reloading...';
reloadingText.style = "display: none;";

containerDiv.appendChild(refreshButton);
containerDiv.appendChild(reloadingText);

containerDiv.style.display = 'flex';
containerDiv.style.alignItems = 'center';
containerDiv.style.gap = '10px'; // Space between the button and text

originalTitleDiv.appendChild(containerDiv);

refreshButton.addEventListener('click', () => {
    reloadWhileNeeded()
});
// =====End load=====

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shouldRefreshTags(tagsDiv) {
    for (const div of tagsDiv.querySelectorAll("a.list__item div.list__item__right trace-symbol")) {
        const status = div.getAttribute("status");
        console.log("Status found: '" + status + "'")
        // Good statuses: SUCCEEDED
        // Statuses to refresh: IDLE (unsure, before it runs), PROCESSING
        if (status == "IDLE" || status == "PROCESSING")
            return true;
    }
    return false;
}


async function reloadWhileNeeded() {
    const parser = new DOMParser();
    async function reloadInner() {
        console.log("Re requesting page.")
        await fetch(window.location.href, {
            "headers": {
              "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
              "accept-language": "en-GB,en;q=0.7",
              "cache-control": "max-age=0",
              "priority": "u=0, i",
              "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Brave\";v=\"133\", \"Chromium\";v=\"133\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "document",
              "sec-fetch-mode": "navigate",
              "sec-fetch-site": "none",
              "sec-fetch-user": "?1",
              "sec-gpc": "1",
              "upgrade-insecure-requests": "1"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
          }).then(async response => {
                const responseDoc = parser.parseFromString(await response.text(), 'text/html');
                const { _, tagd } = getTitleAndTagsDiv(responseDoc);
                originalTagsDiv.innerHTML = tagd.innerHTML;

                const shouldRefresh = shouldRefreshTags(tagd);

                console.log("Done loading new page. Should refresh: " + shouldRefresh);
                if (shouldRefresh) {
                    await sleep(DELAY_BETWEEN_REQUESTS);
                    await reloadInner();
                }
            }
        );
    }
    refreshButton.style = "display: none;";
    reloadingText.style = "";
    
    await reloadInner();
    refreshButton.style = "";
    reloadingText.style = "display: none;";
}

if (AUTO_START_REFRESH && shouldRefreshTags(originalTagsDiv))
    reloadWhileNeeded();