// copy.js
// bk6
// 表のコピー機能

function createCopyIcon() {
    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "none");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path1.setAttribute("d", "M4 4H2V14H11V12H4V4Z");
    path1.setAttribute("fill", "currentColor");

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path2.setAttribute("fill-rule", "evenodd");
    path2.setAttribute("clip-rule", "evenodd");
    path2.setAttribute("d", "M5 2H14V11H5V2ZM6 3H13V10H6V3Z");
    path2.setAttribute("fill", "currentColor");

    svg.appendChild(path1);
    svg.appendChild(path2);

    return svg;
}

function createCheckIcon() {
    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "none");

    const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    path.setAttribute(
        "d",
        "M6.27 10.87L3.63 8.23L2.56 9.3L6.27 13.01L14.07 5.21L13 4.14L6.27 10.87Z"
    );

    path.setAttribute("fill", "currentColor");

    svg.appendChild(path);

    return svg;
}

function createCopyButton(text) {
    const button = document.createElement("button");

    button.className = "code-block-copy-button";

    button.setAttribute("aria-label", "Copy code block");
    button.style.opacity = "1";
    button.style.position = "static";

    button.appendChild(
        createCopyIcon()
    );

    button.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();

        try {
            await navigator.clipboard.writeText(text);

            button.replaceChildren(
                createCheckIcon()
            );

            button.classList.add("copied");

            setTimeout(() => {
                button.classList.remove("copied");

                button.replaceChildren(
                    createCopyIcon()
                );
            }, 2000);
        } catch {
            const selection = window.getSelection();

            if (selection) {
                selection.removeAllRanges();

                const range = document.createRange();

                const temporaryElement =
                    document.createElement("span");

                temporaryElement.textContent = text;

                document.body.appendChild(
                    temporaryElement
                );

                range.selectNodeContents(
                    temporaryElement
                );

                selection.addRange(range);

                document.execCommand("copy");

                selection.removeAllRanges();

                temporaryElement.remove();
            }
        }
    });

    return button;
}

function findCopyCells(table) {
    const result = [];

    const walker = document.createTreeWalker(
        table,
        NodeFilter.SHOW_COMMENT
    );

    let comment;

    while ((comment = walker.nextNode())) {
        if (comment.nodeValue.trim() !== "copy") {
            continue;
        }

        const cell =
            comment.parentElement?.closest("td, th");

        if (!cell) {
            continue;
        }

        result.push({
            cell,
            text: cell.textContent.trim()
        });
    }

    return result;
}

function renderCopyButtons() {
    const tables = document.querySelectorAll("table");

    for (const table of tables) {
        const copyCells = findCopyCells(table);

        if (copyCells.length === 0) {
            continue;
        }

        const existingCells =
            table.querySelectorAll(
                "[data-copy-cell='true']"
            );

        for (const cell of existingCells) {
            cell.remove();
        }

        const existingHeaders =
            table.querySelectorAll(
                "[data-copy-header='true']"
            );

        for (const header of existingHeaders) {
            header.remove();
        }

        const headerRow =
            table.querySelector("thead tr");

        if (headerRow) {
            const headerCell =
                document.createElement("th");

            headerCell.dataset.copyHeader = "true";

            headerRow.appendChild(headerCell);
        }

        const bodyRows =
            table.querySelectorAll("tbody tr");

        for (const row of bodyRows) {
            const copyCell =
                document.createElement("td");

            copyCell.dataset.copyCell = "true";

            const target =
                copyCells.find(
                    item =>
                        item.cell.parentElement === row
                );

            if (target) {
                const button =
                    createCopyButton(target.text);

                copyCell.appendChild(button);
            }

            row.appendChild(copyCell);
        }
    }
}

function start() {
    const observer =
        new MutationObserver(() => {
            observer.disconnect();

            renderCopyButtons();

            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });

    renderCopyButtons();

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

start();
