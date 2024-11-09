const express = require('express');
const path = require('path');
const app = express();

// Set a fixed 10-day countdown from server start
const startTime = Date.now();
const endTime = startTime + (10 * 24 * 60 * 60 * 1000); // 10 days

// Global countdown state
const countdownState = {
    startTime: startTime,
    endTime: endTime,
    isComplete: false
};

// Serve static files
app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add endpoint to get countdown state
app.get('/countdown-state', (req, res) => {
    res.json(countdownState);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 
