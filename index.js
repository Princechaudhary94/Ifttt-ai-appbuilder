const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const Client = require('ssh2-sftp-client');

const app = express();
app.use(bodyParser.json());

// OpenAI config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint for IFTTT
app.post('/ifttt-command', async (req, res) => {
  const command = req.body.command;
  if (!command) {
    return res.status(400).send({ error: 'Command is required' });
  }

  try {
    // Step 1: Generate code from ChatGPT
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a code generator." },
        { role: "user", content: command }
      ]
    });

    const generatedCode = completion.data.choices[0].message.content;

    // Step 2: Upload to Code Assets folder via SFTP
    const sftp = new Client();
    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: 22,
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS
    });

    const remoteFilePath = process.env.SFTP_PATH + '/GeneratedCode.java';
    await sftp.put(Buffer.from(generatedCode), remoteFilePath);
    await sftp.end();

    res.send({ status: 'success', message: 'Code generated and uploaded successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
