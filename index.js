require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// setting up open ai
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

client.on("messageCreate", async function (message) {
  try {
    if (message.author.bot) return;
    // const completion = await openai.createChatCompletion({

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Chat with Critic is a friendly chatbot, created by Critic Designs's Team`,
        },
        {
          role: "user",
          content: `${message.content}\n\n`,
        },
      ],
      max_tokens: 500,
      top_p: 1.0,
    });
    // console.log(response.data);
    res = response.data.choices[0].message["content"];
    console.log(`${res}`);
    message.reply(`${res}`);
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.DISCORD_KEY);
