# Moomoo.io AI Bot Sender

This script is a very configurable botting tool for the MMO game [Moomoo.io](http://moomoo.io).

### WARNING: Please do not download any code that claims that it will "fix" or "add features" to this bot code. People have been including trojans and viruses in those unofficial programs. The ONLY official Moomoo bot code authors are `Mega-Mewthree` and `Nebula-Developers`. DO NOT download any other code related to Moomoo bots.

We are not responsible for any damages caused by this project, or derivatives of this project. Use at your own risk.

## Resources

* [Discord](https://discord.gg/VgKFcVf)
* [Subreddit](https://reddit.com/r/Nebula_Devs)

For contributors: [To-Do List](https://github.com/Nebula-Developers/Moomoo-AI-Bot-Sender/projects/1)

## Installation

**NEW VIDEO INSTALLATION GUIDE:** https://www.youtube.com/watch?v=6QfVIt5V4oI

First, you must download and install Node.js: https://nodejs.org/en/

For all the Windows users who have no clue how to open a Command Prompt terminal/console, open `openCommandPrompt.bat`.

### Install Compilers to Make Follow Mouse Command Work (Optional)

If you have already installed the bot code, run `npm uninstall robotjs` in your console/terminal inside of the bot code's directory.

#### Windows

Download and install Visual C++ Build Tools 2015 [here](http://landinghub.visualstudio.com/visual-cpp-build-tools).

Download and install Python 2.7.x [here](https://www.python.org/downloads/release/python-2714/). Make sure you select the option to add it to PATH.

Run the following commands in your console (Command Prompt/Powershell):

    npm config set python python2.7
    npm config set msvs_version 2015

#### Mac OS X

Download and install Python 2.7.x [here](https://www.python.org/downloads/release/python-2714/) if it isn't already installed.

Download and install Xcode [here](https://developer.apple.com/xcode/download/).

#### Unix

You need Python 2.7.x and `make`.

Download and install GCC [here](https://gcc.gnu.org/).

#### All Systems

Run the following command in your console/terminal inside of the bot code's directory:

    npm install robotjs

### Install the Bot Code (Required)

After Node.js is installed, run the below command in your console inside this folder. It is required to install important code the script depends on to run, and you can do that easily with the following command:

    npm install

Or you can run `npminstall.bat` if you are on Windows and you have no clue how to get to a console.

Install a userscript manager:

Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)

Firefox: [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)

Safari: [Tampermonkey](http://tampermonkey.net/?browser=safari)

Microsoft Edge: [Tampermonkey](https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s)

Opera: [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/)


Put the code in showid.user.js into Tampermonkey so that your ID is visible.


Here is the start script:

    node index.js [--probeTribe tribeName] [--probeName playerName] [--num numberOfBots] [--link moomooPartyLink] [--tribe tribeName] [--name botName] [--randNames true] [--chat chatMessage] [--ai true] [--autoHeal true] [--randSkins true]

See the next section for information on everything after `node index.js`.

## Configuration

There are two main modes to this bot, probing and botting.

#### NEW: Open start.bat to get an easier to use UI! For people who can't use the command line very well! (Windows only)

### Botting

Type "setowner \<your ID>" into the node.js console to make the bot obey your commands.

`--num` sets the number of bots. Required for bots to function. Default: `0`

`--link` sets the Moomoo party link. Required for bots to function. Default: none

`--tribe` sets the Moomoo tribe. Default: none

`--name` sets the bots' names. Default: `unknown`

`--randNames` selects random names for the bots. Default: `false`

`--chat` sets the bots' chat message. Default: none

`--ai` enables using commands. If AI is not enabled, the bots spawn and do nothing. Default: `false`

`--autoHeal` enables auto healing. Default: `true`

`--randSkins` randomizes the skin color of bots. Default: `false`

`--hat` changes the hat via ID, name, or keyword, that will be bought/equipped when enough gold is reached. You can find each hat's ID online, and soon in the Tampermonkey script. Default: none

`--autoAttack` enables auto attack (as if they pressed E). Default: `true`

### Probing

`--probeTribe` searches all Moomoo.io servers for any tribes with the given name and returns the IPs so you can use them with --link.

`--probeName` does almost the same thing as --probeTribe, but searches the leaderboards for a player with the given name.

`--probeRegex` makes the arguments provided to the 2 previous probe flags be interpreted as a regular expression. Do not use flags in your regular expression. Note that the starting and ending slashes (`/`) are not required. It is suggested that you surround your search expression in quotation marks so that the terminal doesn't interpret special characters like `>` as command line operators. Default: `false`

You can probe (search) for a name on the leaderboard or a tribe on all the public Moomoo.io servers. This is useful if you want to use the other part of this script to put bots on someone's livestream.

Here is the start script for probing using a tribe name:

    node index.js --probeTribe Nebula

This will return a list of server IPs which have the tribe `Nebula` in them.

Here is the start script for probing using a name on the leaderboard:

    node index.js --probeName Lucario

Similar to the other command, this will return a list of server IPs which have the player `Lucario` on the leaderboard.

Here is an example of regular expression probing:

    node index.js --probeName "Luc" --probeRegex true

This will return all servers where someone whose name has the string `Luc` is on the leaderboard. For example, it will match `Luc`, `Luca`, `Lucario`, and `abcLucdef`. (But not `luc`.)

You can put both the outputs into `--link` for the botting start script.

## Commands

Most commands can be run in the chat (prefixed with `!`) and console, but some commands are activated through alternate methods.

### Inputs

There are two places to input your commands, the console and the chat. Running your commands in the console has no limit as you will never have a permission error, but running commands in chat has multiple drawbacks. Commands in the chat will need to be prefixed with `!` to form something like `!atkid 69`, and you must have the proper permissions to run them. If a command requires owner, then you must run the `setowner` command in the console. The userscript also does this automatically for you. If a command requires sudo, you can use it in the console or as an owner in the chat by prefixing it with `!sudo`.

### Reference

This table documents all of the commands available to you.

Command | Description | Requires
--- | --- | ---
`setowner <ID>` | Makes the player with that ID the bot owner, allowing them to use all commands that require `Owner`. | Sudo
`id <username>` | Gets the ID of a user from their name. | None
`fme` | Makes bots follow you. | Owner
`fid <id>` | Makes the bots follow the player with that ID. | Owner
`atkid <id>` | Makes the bots attack the player with that ID. [BUGGY] | Owner
`s` | Makes the bots stay. | Owner
`r` | Releases the bots from control, but is different from the above command as pressing R to ping will move them. | Owner
`fm` | Makes the bots follow your mouse. May be buggy if the robot.js library didn't compile correctly. | Owner
`hat <name>` | Switches a bot's hat using the ID, name, or keyword. If necessary, the requested hat will be bought. | Owner
`atk` | Toggles auto attack, as if the bots pressed E. | Owner
`sp` | Places a spike. | Owner
`w` | Places a wall. | Owner
`sudo <command> <args...>` | Runs a command with sudo, allowing use of sudo commands outside the console. | Owner
`perm` | Gives you your raw permission level. | None
`redo` | Redoes the last command the bots handled (even if not by you). | None