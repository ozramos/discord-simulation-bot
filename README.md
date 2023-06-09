# Coming soon!

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/131492189/235380571-ca9e6ab0-18e5-4df0-b732-cefde0c4c9f5.gif)

<br>
<br>
<br>
<hr>
<br>
<br>
<br>

# Prereqs
- git - https://git-scm.com/download/win
- NodeJS (we're using 18.15.x, but others might work) - https://nodejs.org/en

# Install

## 1. Install dependencies
```bash
# Clone repo locally
git clone https://github.com/0xozram/discord-simulation-bot
cd discord-simulation-bot

# Install dependencies
npm i

# Copy tmp.env to .env
cp tmp.env .env
```

## 2. Configure bot
- Create your bot on Discord and add the token to `DISCORD_TOKEN` in `.env`
  - See: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
- Add `APPLICATION_ID` in [Portal](https://discord.com/developers/applications) > "General Information" > application id
- Add `SERVER_ID`
  - From the app - https://support.discord.com/hc/en-us/articles/206346498
  - From the browser - it's the first set of numbers after `/channels/`. In this example `https://discord.com/channels/1234567890/xxxxxxx` the ID would be `1234567890`
- (Optional) Add `DEFAULT_CHANNEL_ID`, this will be used for the vuepress docs


## 3. Run the bot and GUI
```bash
# Start bot
npm start

# Start docs/GUI powered by https://widgetbot.io/
npm run docs
```

<br>
<br>
<br>
<hr>
<br>
<br>
<br>

# Todo
- Enable Global commands...this will probably be the default anyways: https://discordjs.guide/creating-your-bot/command-deployment.html#global-commands
