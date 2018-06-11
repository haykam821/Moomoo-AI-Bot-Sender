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

const request = require("request");
const http = require("http");
const url = require("url");
const fs = require("fs");
const { spawn } = require("child_process");

if (!fs.existsSync(`${__dirname}/lastUpdated.txt`) || Date.now() - parseInt(fs.readFileSync(`${__dirname}/lastUpdated.txt`, "utf8")) > 43200000) {
	spawn("node", [`${__dirname}/autoupdate.js`], {
		stdio: "ignore",
		shell: true,
		detached: true,
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

const Bot = require("module.js");

function escapeRegExp(s) {
	if (s.startsWith("/") && s.endsWith("/")) {
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
	if (probeRegex) {
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
