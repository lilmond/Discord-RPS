const gateWay = "wss://gateway.discord.gg/?v=10&encoding=json"

var socket = null;

submitButton.onclick = () => {
    hideError();
    submitButton.disabled = true;

    console.log("Opening socket...");

    socket = new WebSocket(gateWay);
    let discordReadyReceived = false;

    socket.addEventListener("open", (event) => {
        console.log("Socket has opened!");

        const loginPayload = {
            op: 2,
            d: {
                token: token.value,
                properties: {
                    os: "linux",
                    browser: "disco",
                    device: "disco"
                },
                presence: {
                    activities: [{
                        name: rpsName.value || null,
                        type: !isNaN(parseInt(type.value)) ? parseInt(type.value): null,
                        url: url.value || null,
                        created_at: !isNaN(parseInt(createdAt.value)) ? parseInt(createdAt.value) : null,
                        timestamps: isValidJSON(timestamps.value) ? JSON.parse(timestamps.value) : null,
                        application_id: applicationId.value || null,
                        details: details.value || null,
                        state: state.value || null,
                        emoji: isValidJSON(emoji.value) ? JSON.parse(emoji.value) : null,
                        party: isValidJSON(party.value) ? JSON.parse(party.value) : null,
                        assets: isValidJSON(assets.value) ? JSON.parse(assets.value) : null,
                        secrets: isValidJSON(secrets.value) ? JSON.parse(secrets.value) : null,
                        instance: instance.value == "true",
                        flags: !isNaN(parseInt(flags.value)) ? parseInt(flags.value) : null,
                        buttons: isValidJSON(buttons.value) ? JSON.parse(buttons.value) : null
                    }],
                    status: rpsStatus.value,
                    since: !isNaN(parseInt(since.value)) ? parseInt(since.value): null,
                    afk: afk.value == "true"
                }
            },
        }

        console.log(loginPayload);

        socket.send(JSON.stringify(loginPayload));

        closeButton.disabled = false;
    });

    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        if (message.t == "READY") {
            discordReadyReceived = true;
        }

        console.log(`Message Data: ${event.data}`);
    });

    socket.addEventListener("close", (event) => {
        console.log(`Socket has closed! ${event.data}`);

        if (!discordReadyReceived) {
            showError("ERROR: Invalid token!");
        }

        submitButton.disabled = false;
        closeButton.disabled = true;
    });

    socket.addEventListener("error", (event) => {
        console.log("An error has occured with the socket.");
    });
};

closeButton.onclick = () => {
    if (socket) {
        socket.close();
        console.log("Socket closed!");
    }
};

const main = () => {
    closeButton.disabled = true;
};

main();