import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize express app
const app = express();

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Set the port
const port = process.env.PORT || 5100;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
