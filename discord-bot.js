require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

client.once('ready', () => {
    console.log('Discord bot is ready!');
});

app.post('/send-discord-message', async (req, res) => {
    const { type, data } = req.body;
    const userId = process.env.DISCORD_USER_ID;

    try {
        const user = await client.users.fetch(userId);
        let message = `New ${type}:\n`;
        for (const [key, value] of Object.entries(data)) {
            message += `${key}: ${value}\n`;
        }
        await user.send(message);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);

