const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Function to read countdown data
function getCountdownState() {
    try {
        const data = fs.readFileSync('countdown-data.json');
        const countdownState = JSON.parse(data);
        
        // If countdown hasn't been initialized yet
        if (!countdownState.startTime) {
            countdownState.startTime = Date.now();
            countdownState.endTime = countdownState.startTime + (10 * 24 * 60 * 60 * 1000);
            countdownState.isComplete = false;
            
            // Save the initialized state
            fs.writeFileSync('countdown-data.json', JSON.stringify(countdownState, null, 4));
        }
        
        return countdownState;
    } catch (error) {
        console.error('Error reading countdown state:', error);
        return {
            startTime: Date.now(),
            endTime: Date.now() + (10 * 24 * 60 * 60 * 1000),
            isComplete: false
        };
    }
}

// Serve static files
app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add endpoint to get countdown state
app.get('/countdown-state', (req, res) => {
    const countdownState = getCountdownState();
    res.json(countdownState);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 
