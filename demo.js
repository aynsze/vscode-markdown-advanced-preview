// demo.js
// bk6
// デモ

function renderDemos() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_COMMENT
    );

    const demoNodes = [];

    let node;

    while ((node = walker.nextNode())) {
        const comment = node.nodeValue.trim();

        if (comment.startsWith("demo")) {
            demoNodes.push(node);
        }
    }

    for (const demoNode of demoNodes) {
        renderDemo(demoNode);
    }
}

function getCodeBlockLanguage(pre) {
    const code = pre.querySelector("code");

    if (!code) {
        return null;
    }

    const className = code.className;

    const match = className.match(
        /(?:language|lang)-(html|css|js)\b/
    );

    return match?.[1] ?? null;
}

function getPreviousCodeBlocks(node) {
    const codeBlocks = {};

    let current = node.previousElementSibling;

    while (current) {
        const isHeading =
            /^H[1-6]$/.test(current.tagName) ||
            current.querySelector("h1, h2, h3, h4, h5, h6");

        if (isHeading) {
            break;
        }

        if (current.tagName === "PRE") {
            const language =
                getCodeBlockLanguage(current);

            if (
                language &&
                codeBlocks[language] === undefined
            ) {
                const code =
                    current
                        .querySelector("code")
                        ?.textContent
                        .trim() ?? "";

                codeBlocks[language] = code;
            }
        }

        current = current.previousElementSibling;
    }

    return codeBlocks;
}

function normalizeCss(css) {
    if (!css) {
        return "";
    }

    const trimmed = css.trim();

    if (!trimmed) {
        return "";
    }

    if (
        trimmed.includes("{") ||
        trimmed.includes("}")
    ) {
        return trimmed;
    }

    return `div {\n    ${trimmed}\n}`;
}

function extractDemoCode(node) {
    const codeBlocks = {};

    const regex =
        /```(html|css|js)\s*\n([\s\S]*?)```/g;

    let match;

    while ((match = regex.exec(node.nodeValue)) !== null) {
        const language = match[1];
        const code = match[2].trim();

        codeBlocks[language] = code;
    }

    const previousCodeBlocks =
        getPreviousCodeBlocks(node);

    for (const language of ["html", "css", "js"]) {
        if (codeBlocks[language] === undefined) {
            codeBlocks[language] =
                previousCodeBlocks[language];
        }
    }

    if (codeBlocks.css) {
        codeBlocks.css =
            normalizeCss(codeBlocks.css);
    }

    return codeBlocks;
}

function renderDemo(node) {
    if (
        node.nextSibling &&
        node.nextSibling.tagName === "IFRAME"
    ) {
        return;
    }

    const codeBlocks =
        extractDemoCode(node);

    const jsCode = codeBlocks.js ?? "";

    const expressionWithoutComment =
        jsCode
            .trim()
            .replace(/\/\/.*$/, "")
            .trim()
            .replace(/;\s*$/, "")
            .trim();

    const isSimpleExpression =
        expressionWithoutComment.length > 0 &&
        !/\r?\n/.test(expressionWithoutComment) &&
        !/[;]/.test(expressionWithoutComment) &&
        !/^(const|let|var|if|for|while|switch|try|throw|function|class|return|import|export)\b/.test(
            expressionWithoutComment
        );

    const executableJs = isSimpleExpression
        ? `window.__demoResult = (${expressionWithoutComment});`
        : jsCode;

    const iframe = document.createElement("iframe");

    iframe.style.width = "100%";
    iframe.style.border = "1px solid #ccc";
    iframe.style.borderRadius = "3px";

    const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
    );

    const csp =
        cspMeta?.getAttribute("content") ?? "";

    const nonceMatch = csp.match(
        /script-src[^;]*'nonce-([^']+)'/
    );

    const nonce = nonceMatch?.[1] ?? "";

    iframe.addEventListener("load", () => {
        const updateHeight = () => {
            const document = iframe.contentDocument;

            if (!document?.body) {
                return;
            }

            const height =
                document.body.scrollHeight + 16;

            iframe.style.height =
                `${height}px`;
        };

        updateHeight();

        const resizeObserver =
            new ResizeObserver(() => {
                updateHeight();
            });

        resizeObserver.observe(
            iframe.contentDocument.body
        );
    });

    iframe.srcdoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                ${codeBlocks.css ?? ""}

                ul {
                    margin: 0;
                }

                #js-result:empty {
                    display: none;
                }

                #js-console {
                    display: none;
                }

                #js-console-title {
                    border-bottom: 1px solid #ccc;
                    color: #008000;
                    font-family: monospace;
                    padding-bottom: 4px;
                }

                #js-console-output {
                    white-space: pre-wrap;
                }

                #js-console-output > div {
                    color: black;
                }
            </style>
        </head>

        <body>
            ${codeBlocks.html ?? ""}

            ${codeBlocks.js
            ? `
                        <div id="js-result"></div>

                        <div id="js-console">
                            <div id="js-console-title">
                                console
                            </div>

                            <div id="js-console-output"></div>
                        </div>
                    `
            : ""
        }

            ${codeBlocks.js
            ? `
                        <script nonce="${nonce}">
                            (() => {
                                const consoleElement =
                                    document.getElementById(
                                        "js-console"
                                    );

                                const consoleOutput =
                                    document.getElementById(
                                        "js-console-output"
                                    );

                                console.log = (...args) => {
                                    consoleElement.style.display =
                                        "block";

                                    const line =
                                        document.createElement(
                                            "div"
                                        );

                                    line.textContent = args
                                        .map(value => {
                                            if (
                                                typeof value ===
                                                "string"
                                            ) {
                                                return value;
                                            }

                                            try {
                                                return JSON.stringify(
                                                    value
                                                );
                                            } catch {
                                                return String(
                                                    value
                                                );
                                            }
                                        })
                                        .join(" ");

                                    consoleOutput.appendChild(
                                        line
                                    );
                                };
                            })();
                        <\/script>

                        <script nonce="${nonce}">
                            ${executableJs}
                        <\/script>

                        <script nonce="${nonce}">
                            const result =
                                window.__demoResult;

                            if (
                                result !== undefined
                            ) {
                                const resultElement =
                                    document.getElementById(
                                        "js-result"
                                    );

                                if (
                                    typeof result ===
                                    "object"
                                ) {
                                    try {
                                        resultElement.textContent =
                                            JSON.stringify(
                                                result
                                            );
                                    } catch {
                                        resultElement.textContent =
                                            String(
                                                result
                                            );
                                    }
                                } else {
                                    resultElement.textContent =
                                        String(result);
                                }
                            }
                        <\/script>
                    `
            : ""
        }
        </body>
        </html>
    `;

    node.parentNode.insertBefore(
        iframe,
        node.nextSibling
    );
}

renderDemos();

const observer = new MutationObserver(() => {
    renderDemos();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});