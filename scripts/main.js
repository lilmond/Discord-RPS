const gateway = "wss://gateway.discord.gg/?v=10&encoding=json"
const showLogs = false;

var socket = null;
let keepConnection = false;

const getPresenceJson = () => {
    return {
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
    };
};

const connect = () => {
    hideError();
    submitButton.disabled = true;
    keepConnection = true;

    showLogs ? console.log("Opening socket...") : null;

    socket = new WebSocket(gateway);
    let discordReadyReceived = false;

    socket.addEventListener("open", (event) => {
        showLogs ? console.log("Socket has opened!") : null;

        const loginPayload = {
            op: 2,
            d: {
                token: token.value,
                properties: {
                    os: "linux",
                    browser: "disco",
                    device: "disco"
                },
                presence: getPresenceJson()
            },
        }

        showLogs ? console.log(loginPayload) : null;

        socket.send(JSON.stringify(loginPayload));

        closeButton.disabled = false;
        updateButton.disabled = false;
    });

    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        if (message.t == "READY") {
            discordReadyReceived = true;
        }

        showLogs ? console.log(`Message Data: ${event.data}`) : null;
    });

    socket.addEventListener("close", (event) => {
        showLogs ? console.log(`Socket has closed! ${event.data}`) : null;

        if (!discordReadyReceived) {
            showError("ERROR: Invalid token!");
        } else if (keepConnection == true) {
            showLogs ? console.log("Reconecting...") : null;
            return connect();
        }
        
        submitButton.disabled = false;
        closeButton.disabled = true;
        updateButton.disabled = true;

    });

    socket.addEventListener("error", (event) => {
        showLogs ? console.log("An error has occured with the socket.") : null;
    });

    const heartbeatPayload = {
        op: 1,
        d: null
    }

    const keepAlive = setInterval(() => {
        if (socket.readyState == 1) {
            socket.send(JSON.stringify(heartbeatPayload));
        } else {
            clearInterval(keepAlive);
        }
    }, 10000);
};

submitButton.onclick = connect;

closeButton.onclick = () => {
    if (socket) {
        keepConnection = false;
        socket.close();
    }
};

updateButton.onclick = () => {
    if (socket) {
        if (socket.readyState == 1) {
            const presencePayload = {
                op: 3,
                d: {
                    presence: getPresenceJson()
                },
            }
    
            socket.send(JSON.stringify(presencePayload));
        }
    }
};

const main = () => {
    closeButton.disabled = true;
    updateButton.disabled = true;
};

main();
