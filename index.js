/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

*/

/*
Moomoo-AI-Bot-Sender
Copyright (C) 2018 Mega Mewthree

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Created on April 22nd, 2018

const io = require("socket.io-client");
const request = require("request");
const http = require("http");
const url = require("url");
const fs = require("fs");
const { spawn } = require("child_process");

let parser = null;
try {
	require.resolve("socket.io-msgpack-parser");
	parser = require("socket.io-msgpack-parser");
}catch(e) {
	console.error("Socket.io Msgpack Parser was not installed. Exiting and installing...");
	spawn("npm", ["install"], {
		stdio: "ignore",
		shell: true,
		detached: true
	});
	process.exit();
}

if (!fs.existsSync(`${__dirname}/lastUpdated.txt`) || Date.now() - parseInt(fs.readFileSync(`${__dirname}/lastUpdated.txt`, "utf8")) > 43200000) {
	spawn("node", [`${__dirname}/autoupdate.js`], {
		stdio: "ignore",
		shell: true,
		detached: true
	});
}

let computer = null;

try {
	require.resolve("robotjs");
	computer = require("robotjs");
}catch(e) {
	console.error("Robot.js was not installed correctly. Follow mouse function is disabled.");
}

const screen = computer && computer.getScreenSize();

const args = parseFlags(process.argv.slice(2).join(" "), ["--num", "--link", "--tribe", "--name", "--randNames", "--randSkins", "--chat", "--ai", "--probeTribe", "--probeName", "--probeRegex", "--autoHeal", "--hat", "--autoAttack"]);

const httpServer = http.createServer((req, res) => {
	const args = url.parse(req.url, true).query;
	if (args.ownerID) {
		ownerID = args.ownerID;
		console.log(`Set owner ID to ${args.ownerID}`);
	}
	if (args.spawned && followMouse) {
		goto.x = goto.y = null;
		stay = false;
		followID = null;
		attackFollowedPlayer = false;
		followMouse = false;
		console.log("Stopped following mouse due to owner spawn");
	}
	res.writeHead(204);
	res.end();
});
httpServer.on("listening", () => {
	console.log(`Http server ready at ${Date.now()}`);
});
httpServer.listen(15729);

let ownerID = null;
let followID = null;

let attackFollowedPlayer = false;
let stay = false;

const goto = { x: null, y: null };

let mousePos = { x: 0, y: 0 };
let followMouse = false;
let getMouseInputInterval = null;
if (computer) {
	getMouseInputInterval = setInterval(() => {
		mousePos = computer.getMousePos();
	}, 200);
}

function get(url) {
	return new Promise((resolve, reject) => {
		request(url, (err, res, body) => {
			if (err) {
				reject(err);
				return;
			}
			if (body) {
				resolve(body);
			}
		});
	});
}

function parseFlags(string, flags_array) {
	if (!Array.isArray(flags_array)) {
		return { error: "Array of flags not found." };
	}
	const return_object = {};
	const flag_locations = [[-1, "null", []]];
	const string_array = string.split(" ");
	for (let index = 0; index < string_array.length; index++) {
		if (flags_array.indexOf(string_array[index]) > -1) {
			flag_locations.push([index, string_array[index], []]);
		}else{
			flag_locations[flag_locations.length - 1][2].push(string_array[index]);
		}
	}
	for (let index = 0; index < flag_locations.length; index++) {
		return_object[flag_locations[index][1].replace(/^(-*)/g, "")] = {};
		return_object[flag_locations[index][1].replace(/^(-*)/g, "")].flagLocation = flag_locations[index][0];
		return_object[flag_locations[index][1].replace(/^(-*)/g, "")].value = flag_locations[index][2].join(" ");
	}
	return return_object;
}

function getIP(link) {
	link = link.match(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g);
	if (link.length > 0) {
		return link[link.length - 1];
	}else{
		return false;
	}
}

function processInput(line) {
	const a = line.split(" ");
	const command = a.shift();
	if (command == "setowner") {
		ownerID = a[0];
	}
}

function getHatID(name) {
	const possiblyInt = parseInt(name);
	if (!isNaN(possiblyInt)) {
		return possiblyInt;
	}else{
		if (!name || !name.toString) return null;
		let safeName = name.toString().toLowerCase();
		safeName = safeName.replace(/[$-/:-?{-~!"^_`\[\]]/g, ""); // remove symbols
		safeName = safeName.replace(/\s/g, ""); // remove whitespace
		safeName = data.hatAliases[safeName];
		if (!isNaN(safeName)) return safeName;
		return null;
	}
}

const data = require("./data.json");

const names = [
	"Wally",
	"Tanika",
	"Lenna",
	"Reid",
	"Joshua",
	"Miguelina",
	"Enda",
	"Ona",
	"Natashia",
	"Matt",
	"Shenika",
	"Tommye",
	"Corrin",
	"Angelyn",
	"Owen",
	"Zachariah",
	"Renata",
	"Shiloh",
	"Joesph",
	"Teresia",
	"Barabara",
	"Bee",
	"Janae",
	"Christel",
	"Tequila",
	"Becki",
	"Jacki",
	"Eboni",
	"Madge",
	"Elizabeth",
	"Ingeborg",
	"Latoyia",
	"Aretha",
	"Cecile",
	"Verdell",
	"Valda",
	"Pandora",
	"Alvina",
	"Tiara",
	"Kristopher",
	"Mikel",
	"Annita",
	"Concetta",
	"Reita",
	"Clarine",
	"Warner",
	"Stephani",
	"Herlinda",
	"Jeraldine",
	"Hunter",
];

const allServers = [
	{
		"ip":"45.76.136.65",
		"maxPlayers":80,
		"experimental":false,
	},
	{
		"ip":"45.76.133.132",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.138.87",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"108.61.172.61",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"108.61.172.171",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.142.135",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.88.200",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.59.212",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.133.107",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.56.35",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.226.52",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.132.116",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.132.153",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.183.22",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.174.199",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.100.199",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.185.114",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.174.163",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.172.118",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.139.158",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"108.61.173.191",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.140.136",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.185.37",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.128.8",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"108.61.173.128",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.141.118",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.96.219",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.140.11",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.56.124",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"108.61.175.195",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.140.159",
		"maxPlayers":80,
		"experimental":true,
	},
	{
		"ip":"45.76.82.46",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.32.155.246",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.76.89.139",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.76.91.231",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.63.119.195",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.53.1",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.116.80",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.119.207",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.119.52",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.153.139",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.143.240",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.156.154",
		"maxPlayers":80,
		"experimental":false,
	},
	{
		"ip":"45.76.84.243",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.141.202",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.65.89",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.87.213",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.87.26",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.159.33",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.159.20",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.53.215",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"108.61.190.220",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.92.133",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.85.241",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.207.130.132",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.207.131.132",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.119.244",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.84.207",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.85.159",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.94.198",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.67.137",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.92.138",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.86.95",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.90.54",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.207.151.1",
		"maxPlayers":80,
		"experimental":true,
	},
	{
		"ip":"45.63.83.190",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.77.187.224",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"104.156.231.170",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.77.185.222",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.32.131.170",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.156.231.84",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.84.67",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.139.137",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.87.14",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.3.146",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.0.180",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.183.121",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.130.32",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.141.144",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.2.244",
	},
	{
		"ip":"45.63.90.253",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.184.80",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.181.215",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.141.124",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.88.172",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.2.123",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.86.66",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.89.186",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.95.94",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.0.61",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.4.113",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.182.118",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.84.223",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.7.228",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.84.65",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.184.245",
		"maxPlayers":80,
		"experimental":false,
	},
	{
		"ip":"45.63.83.173",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.93.208",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.87.182",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"207.246.66.206",
		"maxPlayers":80,
		"experimental":true,
	},
	{
		"ip":"45.77.163.153",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.77.164.226",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"207.246.67.140",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.32.163.130",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.77.163.173",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.174.88",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.156.247.133",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.192.182",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.109.213",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.168.83",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.169.37",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.207.147.14",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.118.112",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.168.187",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.156.244.247",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.193.252",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.165.21",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.192.49",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.104.17",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.175.103",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.111.179",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.192.175",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.169.197",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.192.149",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.164.181",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.192.112",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.192.132",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.174.168",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.167.61",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.162.62",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.192.177",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"104.238.136.101",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.160.82",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.192.136",
		"maxPlayers":80,
		"experimental":false,
	},
	{
		"ip":"45.77.37.126",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.32.72",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.108.134",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.150.102",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.37.202",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.182.186",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.40.183",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.163.225",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.32.131",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.103.118",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.33.206",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.104.160",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.116.159",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.105.212",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.113.18",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.109.24",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.180.83",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.119.216",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.77.38.189",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.160.21",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.117.201",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"107.191.56.127",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.117.68",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"108.61.185.149",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.242.88",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.32.245.179",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.120.98",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.113.134",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.123.248",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.25.76",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.63.28.39",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.112.235",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"103.43.75.103",
		"maxPlayers":40,
		"experimental":false,
	},
	{
		"ip":"45.76.123.234",
		"maxPlayers":40,
		"experimental":false,
	},
	// Dev servers
	{
		"ip":"45.32.130.215",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.63.90.79",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.77.2.192",
		"maxPlayers":40,
		"experimental":true,
	},
	{
		"ip":"45.77.0.43",
		"maxPlayers":40,
		"experimental":false, // Uncertain
	},
	{
		"ip":"45.32.128.142",
		"maxPlayers":40,
		"experimental":false, // Uncertain
	},
	{
		"ip":"45.63.93.27",
		"maxPlayers":40,
		"experimental":false, // Uncertain
	},
	{
		"ip":"45.77.2.25",
		"maxPlayers":40,
		"experimental":false, // Uncertain
	},
	{
		"ip":"45.63.82.111",
		"maxPlayers":40,
		"experimental":false, // Uncertain
	},
	{
		"ip":"45.77.7.137",
		"maxPlayers":40,
		"experimental":false, // Uncertain
	},
	{
		"ip":"45.63.88.19",
		"maxPlayers":40,
		"experimental":false, // Uncertain
	},
];

const bots = [];
const tribes = {};
const players = {};

class Bot {
	constructor(n, ip, name, tribe, chatMsg, ai, probe, autoHeal, randSkins, hatID, autoAttack) {
		this.number = n;
		this.ip = ip;
		this.name = name || "unknown";
		this.tribe = tribe;
		this.chatMsg = chatMsg;
		this.origChatMsg = chatMsg;
		this.ai = ai;
		this.probe = probe;
		this.autoHeal = autoHeal;
		this.randSkins = randSkins;
		this.hatID = hatID;
		this.autoAttack = autoAttack;
		this.lastRandAngleUpdate = 0;
		this.pos = {
			x: 0,
			y: 0,
		};
		this.materials = {
			"wood": 0,
			"stone": 0,
			"food": 0,
			"points": 0,
		};
		this.chatInterval = undefined;
		this.reqint = undefined;
		this.updateInterval = undefined;
		this.key = null;
		this.id = null;
	}
	async connect() {
		const sk = this.socket = io.connect(`http://${this.ip}:${5000 + (this.number % 11)}`, {
			reconnection: false,
			query: "man=1",
			transportOptions: {
				polling: {
					extraHeaders: {
						"Origin": "http://moomoo.io",
						"Referer": "http://moomoo.io",
					},
				},
			},
			parser: parser,
		});
		if (this.probe) {
			sk.once("disconnect", () => {
				bots.splice(bots.indexOf(this), 1);
				this.socket.removeAllListeners();
				this.socket = null;
				if (bots.length === 0) {
					console.log("Probe finished.");
					process.exit();
				}
			});
			sk.once("connect", () => {
				bots.push(this);
				this.spawn();
			});
			// Spawn (id)
			sk.on("1", r => {
				this.id = r;
				setTimeout(this.socket.disconnect.bind(this.socket), 5000);
			});
			// Leaderboard
			sk.on("5", data => {
				if (probeName){
					if ((probeName instanceof RegExp && data.filter(d => typeof d === "string" && d.match(probeName)).length > 0) || (typeof probeName === "string" && data.indexOf(probeName) > -1)){
						console.log(`${this.ip}`);
						sk.disconnect();
					}
				}
			});
			// ID (tribes[name, owner])
			sk.on("id", (data) => {
				data.teams.forEach(t => {
					if (probeTribe){
						if ((probeTribe instanceof RegExp && t.sid.match(probeTribe)) || (typeof probeTribe === "string" && t.sid === probeTribe)){
							console.log(`${this.ip}`);
							sk.disconnect();
						}
					}
				});
			});
			return true;
		}else{
			sk.once("disconnect", () => {
				bots.splice(bots.indexOf(this), 1);
				console.log(`${this.number} disconnected`);
				clearInterval(this.chatInterval);
				clearInterval(this.reqint);
				clearInterval(this.updateInterval);
				setTimeout(this.connect.bind(this), 2000);
				this.socket.removeAllListeners();
				this.socket = null;
			});
			sk.once("connect", () => {
				console.log(`${this.number} connected`);
				bots.push(this);
				this.spawn();
			});
			// Spawn (id)
			sk.on("1", r => {
				console.log(`${this.number} spawned`);
				this.id = r;
				this.tribe && sk.emit("8", this.tribe);
				if (this.chatMsg) this.chatInterval = setInterval(this.chat.bind(this), 3000);
				this.tribe && (this.reqint = setInterval(this.join.bind(this), 5000));
				if (this.ai) this.updateInterval = setInterval(this.update.bind(this), 1000);
			});
			// Player Add ([l_id, id, name, x, y, angle, ?, ?, ?, ?], main)
			sk.on("2", (data, main) => {
				if (main) {
					this.longId = data[0];
					this.id = data[1];
					this.pos.x = data[3];
					this.pos.y = data[4];
					this.angle = data[5];
				}
				players[data[1]] = {
					longID: data[0],
					name: data[2],
					x: data[3],
					y: data[4],
					angle: data[5],
					lastUpdated: Date.now(),
				};
			});
			// Player Update ([id, x, y, angle, ?, ?, ?, tribe, ?, ?, ?, ?, ?])
			sk.on("3", (data) => {
				for (let i = 0, len = data.length / 13; i < len; i++) {
					if (this.id == data[0 + i * 13]) {
						this.pos.x = data[1 + i * 13];
						this.pos.y = data[2 + i * 13];
						this.angle = data[3 + i * 13];
					}
					if (!players[data[0 + i * 13]]) {
						players[data[0 + i * 13]] = {
							x: data[1 + i * 13],
							y: data[2 + i * 13],
							angle: data[3 + i * 13],
							lastUpdated: Date.now(),
						};
					}else{
						const p = players[data[0 + i * 13]];
						p.x = data[1 + i * 13];
						p.y = data[2 + i * 13],
						p.angle = data[3 + i * 13],
						p.lastUpdated = Date.now();
					}
				}
				this.update();
			});
			// Player Remove (l_id)
			sk.on("4", (longID) => {
				if (this === bots[0]) {
					for (const k in players) {
						if (this === bots[0]) {
							if (players[k].longID == longID) delete players[k];
						}
					}
				}
			});
			// Resource obtained
			sk.on("9", (type, amount) => {
				this.materials[type] = amount;
				this.tryHatOn(this.hatID);
			});
			// Damaged
			if (this.autoHeal) {
				sk.on("10", (id, health) => {
					if (id == this.id && health < 100) {
						setTimeout(this.heal.bind(this), 75 + (Math.random() / 10) | 0);
					}
				});
			}
			// Death
			sk.on("11", () => {
				console.log(`${this.number} died`);
				clearInterval(this.chatInterval);
				clearInterval(this.reqint);
				clearInterval(this.updateInterval);
				setTimeout(this.spawn.bind(this), 20);
			});
			// Tribe Delete (name)
			sk.on("ad", (name) => {
				if (this === bots[0]) {
					if (tribes[name]) delete tribes[name];
				}
			});
			// Tribe add request ({sid, owner})
			sk.on("ac", (data) => {
				tribes[name] = { owner: data.owner, players: [] };
			});
			// Tribe join request (id, name)
			sk.on("an", (id, name) => {
				sk.emit("11", id, 1);
				if (players[id]) {
					players[id].inMainTribe = true;
				}else{
					players[id] = { inMainTribe: true };
				}
			});
			// Chat (id, name)
			sk.on("ch", (id, msg) => {
				if (id != ownerID) return;
				if (!msg.startsWith("!")) return;
				const args = msg.slice(1).trim().split(/ +/g);
				const command = args.shift().toLowerCase();
				if (command === "fme") {
					goto.x = goto.y = null;
					stay = false;
					followID = ownerID;
					attackFollowedPlayer = false;
					followMouse = false;
				}else if (command === "id") {
					const a = [];
					for (const k in players) {
						if (players[k].name === args.join(" ")) a.push(k);
					}
					if (a.length > 0) {
						this.chatMsg = a.join(", ").slice(0, 30);
					}else{
						this.chatMsg = "Player not in memory.";
					}
					clearInterval(this.chatInterval);
					this.chatInterval = null;
					setTimeout(this.chat.bind(this), 1000);
				}else if (command === "fid") {
					goto.x = goto.y = null;
					stay = false;
					followID = parseInt(args[0]);
					attackFollowedPlayer = false;
					followMouse = false;
				}else if (command === "atkid") {
					goto.x = goto.y = null;
					stay = false;
					followID = parseInt(args[0]);
					attackFollowedPlayer = true;
					followMouse = false;
				}else if (command === "s") {
					goto.x = goto.y = null;
					stay = true;
					followID = null;
					attackFollowedPlayer = false;
					followMouse = false;
				}else if (command === "r") {
					goto.x = goto.y = null;
					stay = false;
					followID = null;
					attackFollowedPlayer = false;
					followMouse = false;
				}else if (command === "fm" && computer) {
					goto.x = goto.y = null;
					stay = false;
					followID = null;
					attackFollowedPlayer = false;
					followMouse = true;
				}else if (command === "hat" && args[0]) {
					const hatToEquip = args[0];
					let len = bots.length;
					let bot, triedHat;
					while (len--) {
						bot = bots[len];
						triedHat = bot.tryHatOn(hatToEquip);
						if (triedHat) {
							bot.chatMsg = "Switched hat.";
						}else if (triedHat === false) {
							bot.chatMsg = `Need ${data.hatPrices[getHatID(hatToEquip)] - bot.materials.points} more gold.`;
						}else{
							bot.chatMsg = "Invalid hat!";
						}
						clearInterval(bot.chatInterval);
						bot.chatInterval = null;
						setTimeout(bot.chat.bind(bot), 1000);
					}
				}else if (command === "atk") {
					this.autoAttack = !this.autoAttack;
					this.socket && this.socket.emit("7", this.autoAttack);
				}else if (command === "sp") {
					this.socket.emit("5", 5, null);
					this.socket.emit("4", 1, null);
					this.socket.emit("4", 0, null);
					this.socket.emit("5", 1, null);
				}else if (command === "w") {
					this.socket.emit("5", 2, null);
					this.socket.emit("4", 1, null);
					this.socket.emit("4", 0, null);
					this.socket.emit("5", 1, null);
				}
			});
			// ID (tribes[name, owner])
			sk.on("id", (data) => {
				if (this === bots[0]) {
					data.teams.forEach(t => {
						tribes[t.sid] = { owner: t.owner, players: [] };
					});
				}
			});
			// Tribe Update [id_1, name_1, ...]
			sk.on("sa", (data) => {
				if (tribes[this.tribe]) {
					tribes[this.tribe].players = [];
					for (let i = 0, len = data.length; i < len; i += 2) {
						tribes[this.tribe].players.push({ id: data[i], name: data[i + 1] });
					}
				}
			});
			// Tribe Start (name, owner)
			sk.on("st", (name, owner) => {
				if (this === bots[0]) {
					tribes[name] = { owner: owner, players: [] };
				}
			});
			// Minimap Ping (x, y)
			sk.on("p", (x, y) => {
				goto.x = x;
				goto.y = y;
			});
			return true;
		}
	}
	disconnect() {
		this.socket && this.socket.disconnect();
	}
	spawn() {
		this.socket && this.socket.emit("1", {
			name: this.name,
			moofoll: true,
			skin: this.randSkins ? Math.round(Math.random() * 5) : 0,
		});
		this.socket && this.socket.emit("7", this.autoAttack);
		this.tryHatOn(this.hatID);
	}
	join() {
		this.socket && this.tribe && this.socket.emit("10", this.tribe);
	}
	heal() {
		if (!this.socket) return;
		this.socket.emit("5", 0, null);
		this.socket.emit("4", 1, null);
		this.socket.emit("5", 0, true);
	}
	tryHatOn(id) {
		if (!this.socket) return;
		id = getHatID(id);
		if (isNaN(id)) return null;
		if (!isNaN(data.hatPrices[id])) {
			this.hatID = id;
			if (this.materials.points >= data.hatPrices[id]) {
				this.socket.emit("13", 1, id);
				this.socket.emit("13", 0, id);
				return true;
			}else{
				this.socket.emit("13", 0, id);
				return false;
			}
		}
	}
	chat() {
		if (!this.socket) return;
		this.socket.emit("ch", this.chatMsg);
		this.chatMsg = this.origChatMsg;
		if (this.origChatMsg && !this.chatInterval) {
			this.chatInterval = setInterval(this.chat.bind(this), 3000);
		}
	}
	update() {
		if (!this.socket) return;
		if (!this.ai) return;
		if (stay) {
			this.socket.emit(3, null);
		}else if (followMouse) {
			const p = players[ownerID];
			if (p && p.x) {
				const targetX = p.x + (mousePos.x - screen.width / 2);
				const targetY = p.y + (mousePos.y - screen.height / 2);
				if (Math.pow(this.pos.x - targetX, 2) + Math.pow(this.pos.y - targetY, 2) < 20000) {
					this.socket.emit(2, p.angle);
					this.socket.emit(3, null);
				}else{
					this.socket.emit(2, Math.atan2(targetY - this.pos.y, targetX - this.pos.x));
					this.socket.emit(3, Math.atan2(targetY - this.pos.y, targetX - this.pos.x));
				}
			}
		}else if (followID && players[followID]) {
			const p = players[followID];
			if (p && p.x) {
				const now = Date.now();
				if (now - p.lastUpdated > 30000 && now - this.lastRandAngleUpdate > 20000) {
					this.lastRandAngleUpdate = now;
					const randAngle = Math.random() * Math.PI * 2;
					this.socket.emit(2, randAngle);
					this.socket.emit(3, randAngle);
				}else if (!attackFollowedPlayer) {
					if (Math.pow(this.pos.x - p.x, 2) + Math.pow(this.pos.y - p.y, 2) < 20000) {
						this.socket.emit(2, p.angle);
						this.socket.emit(3, null);
					}else{
						this.socket.emit(2, Math.atan2(p.y - this.pos.y, p.x - this.pos.x));
						this.socket.emit(3, Math.atan2(p.y - this.pos.y, p.x - this.pos.x));
					}
				}else{
					this.socket.emit(2, Math.atan2(p.y - this.pos.y, p.x - this.pos.x));
					this.socket.emit(3, Math.atan2(p.y - this.pos.y, p.x - this.pos.x));
				}
			}
		}else if (goto.x && goto.y) {
			if (Math.pow(this.pos.x - goto.x, 2) + Math.pow(this.pos.y - goto.y, 2) < 40000) {
				this.socket.emit(2, 0);
				this.socket.emit(3, null);
			}else{
				this.socket.emit(2, Math.atan2(goto.y - this.pos.y, goto.x - this.pos.x));
				this.socket.emit(3, Math.atan2(goto.y - this.pos.y, goto.x - this.pos.x));
			}
			return;
		}else{
			this.socket.emit(3, null);
		}
	}
}

function escapeRegExp(s) {
	if (s.startsWith("/") && s.endsWith("/")){
		s = s.split("");
		s = s.slice(1, s.length - 1).join("");
	}
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

const numBots = (args.num && parseInt(args.num.value)) || 0;
const link = (args.link && getIP(args.link.value)) || null;
let name = (args.randNames && args.randNames.value.toLowerCase() != "false" && args.randNames.value != 0) ? true : ((args.name && args.name.value) || "unknown");
let tribe = (args.tribe && args.tribe.value) || null;
let chat = (args.chat && args.chat.value) || null;
const ai = args.ai && args.ai.value.toLowerCase() != "false" && args.ai.value.toLowerCase() != "0";
const probeRegex = args.probeRegex && args.probeRegex.value.toLowerCase() != "false" && args.probeRegex.value.toLowerCase() != "0";
const probeTribe = args.probeTribe && (probeRegex ? new RegExp(escapeRegExp(args.probeTribe.value)) : args.probeTribe.value);
const probeName = args.probeName && (probeRegex ? new RegExp(escapeRegExp(args.probeName.value)) : args.probeName.value);
const probe = probeTribe || probeName;
const autoHeal = !args.autoHeal || (args.autoHeal.value.toLowerCase() != "false" && args.autoHeal.value.toLowerCase() != "0");
const randSkins = args.randSkins && args.randSkins.value.toLowerCase() != "false" && args.randSkins.value.toLowerCase() != "0";
const hatID = (args.hat && args.hat.value) || null;
const autoAttack = !args.autoAttack || (args.autoAttack.value.toLowerCase() != "false" && args.autoAttack.value.toLowerCase() != "0");
typeof name === "string" && (name = name.slice(0, 16));
tribe && (tribe = tribe.slice(0, 6));
chat && (chat = chat.slice(0, 30));

if (probe) {
	if (probeRegex){
		console.log(`Initiating probe for${(args.probeTribe && args.probeTribe.value) ? ` tribe ${args.probeTribe.value}` : ""}${(args.probeName && args.probeName.value) ? ` player ${args.probeName.value}` : ""} using regex.`);
	}else{
		console.log(`Initiating probe for${probeTribe ? ` tribe ${probeTribe}` : ""}${probeName ? ` player ${probeName}` : ""}.`);
	}
	(function connectBots(i) {
		if (i <= 0) return;
		const promises = [];
		for (let j = i; (j > i - 8) && (j > 0); j--) {
			promises.push(new Bot(j, allServers[j - 1].ip, "PROBE", tribe, chat, ai, probe, autoHeal, randSkins, hatID, autoAttack).connect());
		}
		Promise.all(promises).then(() => {
			connectBots(i - 8);
		}).catch(console.error);
	})(allServers.length);
}else{
	(function connectBots(i) {
		if (i <= 0) return;
		const promises = [];
		for (let j = i; (j > i - 8) && (j > 0); j--) {
			promises.push(new Bot(j, link, name === true ? names[(Math.random() * names.length) | 0] : name, tribe, chat, ai, probe, autoHeal, randSkins, hatID, autoAttack).connect());
		}
		Promise.all(promises).then(() => {
			connectBots(i - 8);
		}).catch(console.error);
	})(numBots);
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", data => {
	data.split(/[\r\n]+/).forEach(l => {
		processInput(l.trim());
	});
});
process.stdin.resume();

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCAAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAlrdb6gACgkQf4qgY6Fc
SQvzdAgAvHV0emtkSN0OKZt5eW3oBSVpOxum95lia3WVg/KgJOnKwBQuQhpQlZ/0
w4u3YKXTnIisDJAi82YnQsxGXMHoKZ+fIj7jumT5zQjrm0yUV/V/vW6mpLIKrvBq
1A9BFpwV2HHpzacF2gCXvLAzxD1O/PJCGLezHwuOXw/pQMKjCsEDy6LICC2PkxOt
euyL6qDKQrrSQJM+9iewnX0lhJAvNFf3bSAT5ueHRaqtlsj0Ym5XXjsMr4FtMhCQ
vxsdM+ttAkLGIgiUlw24BqMdK8Qkr1RoBSkq9nTS3MXZZzENZMFflcvTbb7y/85D
u31F8EDUjNjx4tVR2zQmPaIMgMepig==
=WVx4
-----END PGP SIGNATURE-----
*/
