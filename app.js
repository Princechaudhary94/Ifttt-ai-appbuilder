// app.js
// यह एक demo script है जो बाद में IFTTT command से trigger होगी

function runApp(command) {
    console.log("Received command from IFTTT: " + command);

    // Example: command के आधार पर अलग काम करना
    if (command.toLowerCase().includes("hello")) {
        console.log("Hello! App is running successfully 🚀");
    } else if (command.toLowerCase().includes("test")) {
        console.log("Testing mode active ✅");
    } else {
        console.log("Unknown command ❓");
    }
}

// Test run
runApp("test command from user");
