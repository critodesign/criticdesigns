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
function checkParagraphLength(paragraph) {
  if (paragraph.length > 2000) {
    return false;
  } else {
    return true;
  }
}

async function openaihandler(message) {
  try {
    if (message.author.bot) return;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Crito has just been activated as your personal AI assistant. As an advanced language model developed by Critic Designs. Get Into The Design World With Critic Designs\n\nOur goal at Critic Designs is to help you advance in your design career, and to make lifelong friends along the way.\n\nThings we provide to our members:\n- Mentorship: You can make your career path very easy by connecting with a perfect mentor in Critic Designs\n- Portfolio Help: Get a portfolio review by an industry professional, which can help you improve your portfolio.\n- Make Friends: Friendships have a huge impact on your mental health and happiness. Good friends relieve stress.\n- Live Chat: Talk to fellow designers about new design trends and grow your skills in Critic Designs Community. Crito is here to help. Just type in your request and let Crito take care of the rest!`,
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
    bo = checkParagraphLength(res);
    if (bo == true) {
      message.reply(`${res}`);
    } else {
      message.reply("Sorry, Discord doesn't want me to Help You");
    }
  } catch (error) {
    console.error("An error occurred while processing a message:", error);
    message.reply("Sorry, something went wrong while processing your message. Please contact the team ");
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", openaihandler);

client.on("error", (error) => {
  console.error("An error occurred:", error);
});

client.login(process.env.DISCORD_KEY);
