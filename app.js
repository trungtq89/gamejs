const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Routing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');
  io.to(socket.id).emit('connected', 'Connected to server');

  // Handle game logic
  socket.on('choice', (data) => {
    console.log('Received choice from client:', data.choice);
    // Generate computer's choice
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    // Determine the winner
    let result;
    if (data.choice === computerChoice) {
      result = 'It\'s a tie!';
    } else if (
      (data.choice === 'rock' && computerChoice === 'scissors') ||
      (data.choice === 'paper' && computerChoice === 'rock') ||
      (data.choice === 'scissors' && computerChoice === 'paper')
    ) {
      result = 'You win!';
    } else {
      result = 'You lose!';
    }

    // Send result to the client
    io.to(socket.id).emit('result', { computerChoice, result });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

