const express = require('express');
const path = require('path');
const app = express();

// Global countdown state
let countdownState = {
    startTime: null,
    endTime: null,
    isComplete: false
};

// Initialize countdown on server start
function initializeCountdown() {
    if (!countdownState.startTime) {
        countdownState.startTime = Date.now();
        countdownState.endTime = countdownState.startTime + (30 * 1000); // 30 seconds
        countdownState.isComplete = false;
    }
}

initializeCountdown();

// Serve static files
app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add endpoint to get countdown state
app.get('/countdown-state', (req, res) => {
    const now = Date.now();
    if (now >= countdownState.endTime && !countdownState.isComplete) {
        countdownState.isComplete = true;
    }
    res.json(countdownState);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 