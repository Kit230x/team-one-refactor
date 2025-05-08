    document.getElementById("sendMessageButton").addEventListener("click", function() {
        const messageInput = document.getElementById("messageInput");
        const message = messageInput.value.trim();

        if (message !== "") {
            const messageDisplay = document.getElementById("messageDisplay");
            const newMessage = document.createElement("div");
            newMessage.textContent = message;
            newMessage.style.padding = "5px 0";
            messageDisplay.appendChild(newMessage);

            messageDisplay.scrollTop = messageDisplay.scrollHeight;

            messageInput.value = "";
        }
    });

    document.getElementById("messageInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            document.getElementById("sendMessageButton").click();
        }
    });
