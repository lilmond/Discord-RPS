const elementIds = {
    form: "form",
    messageContainer: "message_container",
    messageText: "message_text",
    messageCloseButton: "message_close_button",
    saveTokenButton: "save_token_button",
    unsaveTokenButton: "unsave_token_button",
    token: "token",
    device: "device",
    rpsName: "name",
    since: "since",
    rpsStatus: "status",
    afk: "afk",
    type: "type",
    url: "url",
    createdAt: "created_at",
    timestamps: "timestamps",
    applicationId: "application_id",
    details: "details",
    state: "state",
    emoji: "emoji",
    party: "party",
    assets: "assets",
    secrets: "secrets",
    instance: "instance",
    flags: "flags",
    buttons: "buttons",
    closeButton: "close_button",
    submitButton: "submit_button",
    updateButton: "update_button"
};

const autosaveInputs = [
    "rpsName",
    "since",
    "rpsStatus",
    "afk",
    "type",
    "url",
    "createdAt",
    "timestamps",
    "applicationId",
    "details",
    "state",
    "emoji",
    "party",
    "assets",
    "secrets",
    "instance",
    "flags",
    "buttons",
    "device"
];

const uneditableInputs = [
    "device"
];

for (let elementId in elementIds) {
    window[elementId] = document.getElementById(elementIds[elementId]);
};

for (let i = 0; i < autosaveInputs.length; i++) {
    let elementName = autosaveInputs[i];
    let elementId = elementIds[elementName];
    let element = document.getElementById(elementId);
    let savedValue = localStorage.getItem(element.id);

    if (savedValue) {
        element.value = localStorage.getItem(element.id);
    };

    element.onchange = () => {
        /* console.log(`${element.id} changed: ${element.value}`); */
        localStorage.setItem(element.id, element.value);
    };
};

const showError = (textValue) => {
    messageText.innerText = textValue;
    messageContainer.style.display = "block";
};

const hideError = () => {
    messageContainer.style.display = "none";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
});

messageCloseButton.addEventListener("click", hideError);

const isValidJSON = str => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    };
};

const toggleUneditableInputs = (disabled = false) => {
    for (let i = 0; i < uneditableInputs.length; i++) {
        let elementName = uneditableInputs[i];
        let elementId = elementIds[elementName];
        let element = document.getElementById(elementId);

        element.disabled = disabled;
    };
};

saveTokenButton.addEventListener("click", () => {
    localStorage.setItem("token", token.value);
});

unsaveTokenButton.addEventListener("click", () => {
    localStorage.removeItem("token");
});

token.value = localStorage.getItem("token") || "";
