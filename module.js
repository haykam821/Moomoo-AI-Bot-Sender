const io = require("socket.io-client");
const { spawn } = require("child_process");

let parser = null;
try {
	require.resolve("socket.io-msgpack-parser");
	parser = require("socket.io-msgpack-parser");
} catch (e) {
	console.error("Socket.io Msgpack Parser was not installed. Exiting and installing...");
	spawn("npm", ["install"], {
		stdio: "ignore",
		shell: true,
		detached: true,
	});
	process.exit();
}

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
		sk.once("disconnect", () => {
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
			this.players[data[1]] = {
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
				if (!this.players[data[0 + i * 13]]) {
					this.players[data[0 + i * 13]] = {
						x: data[1 + i * 13],
						y: data[2 + i * 13],
						angle: data[3 + i * 13],
						lastUpdated: Date.now(),
					};
				} else {
					const p = this.players[data[0 + i * 13]];
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
			tribes[name] = {
				owner: data.owner,
				players: [],
			};
		});
		// Tribe join request (id, name)
		sk.on("an", (id, name) => {
			sk.emit("11", id, 1);
			if (this.players[id]) {
				this.players[id].inMainTribe = true;
			} else {
				this.players[id] = {
					inMainTribe: true,
				};
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
			} else if (command === "id") {
				const a = [];
				for (const k in this.players) {
					if (this.players[k].name === args.join(" ")) a.push(k);
				}
				if (a.length > 0) {
					this.chatMsg = a.join(", ").slice(0, 30);
				} else {
					this.chatMsg = "Player not in memory.";
				}
				clearInterval(this.chatInterval);
				this.chatInterval = null;
				setTimeout(this.chat.bind(this), 1000);
			} else if (command === "fid") {
				goto.x = goto.y = null;
				stay = false;
				followID = parseInt(args[0]);
				attackFollowedPlayer = false;
				followMouse = false;
			} else if (command === "atkid") {
				goto.x = goto.y = null;
				stay = false;
				followID = parseInt(args[0]);
				attackFollowedPlayer = true;
				followMouse = false;
			} else if (command === "s") {
				goto.x = goto.y = null;
				stay = true;
				followID = null;
				attackFollowedPlayer = false;
				followMouse = false;
			} else if (command === "r") {
				goto.x = goto.y = null;
				stay = false;
				followID = null;
				attackFollowedPlayer = false;
				followMouse = false;
			} else if (command === "fm" && computer) {
				goto.x = goto.y = null;
				stay = false;
				followID = null;
				attackFollowedPlayer = false;
				followMouse = true;
			} else if (command === "hat" && args[0]) {
				const hatToEquip = args[0];
				let len = bots.length;
				let bot, triedHat;
				while (len--) {
					bot = bots[len];
					triedHat = bot.tryHatOn(hatToEquip);
					if (triedHat) {
						bot.chatMsg = "Switched hat.";
					} else if (triedHat === false) {
						bot.chatMsg = `Need ${data.hatPrices[getHatID(hatToEquip)] - bot.materials.points} more gold.`;
					} else {
						bot.chatMsg = "Invalid hat!";
					}
					clearInterval(bot.chatInterval);
					bot.chatInterval = null;
					setTimeout(bot.chat.bind(bot), 1000);
				}
			} else if (command === "atk") {
				this.autoAttack = !this.autoAttack;
				this.socket && this.socket.emit("7", this.autoAttack);
			} else if (command === "sp") {
				this.socket.emit("5", 5, null);
				this.socket.emit("4", 1, null);
				this.socket.emit("4", 0, null);
				this.socket.emit("5", 1, null);
			} else if (command === "w") {
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
					tribes[t.sid] = {
						owner: t.owner,
						players: [],
					};
				});
			}
		});
		// Tribe Update [id_1, name_1, ...]
		sk.on("sa", (data) => {
			if (tribes[this.tribe]) {
				tribes[this.tribe].players = [];
				for (let i = 0, len = data.length; i < len; i += 2) {
					tribes[this.tribe].players.push({
						id: data[i],
						name: data[i + 1],
					});
				}
			}
		});
		// Tribe Start (name, owner)
		sk.on("st", (name, owner) => {
			if (this === bots[0]) {
				tribes[name] = {
					owner: owner,
					players: [],
				};
			}
		});
		// Minimap Ping (x, y)
		sk.on("p", (x, y) => {
			goto.x = x;
			goto.y = y;
		});
		return true;
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
			} else {
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
		} else if (followMouse) {
			const p = this.players[ownerID];
			if (p && p.x) {
				const targetX = p.x + (mousePos.x - screen.width / 2);
				const targetY = p.y + (mousePos.y - screen.height / 2);
				if (Math.pow(this.pos.x - targetX, 2) + Math.pow(this.pos.y - targetY, 2) < 20000) {
					this.socket.emit(2, p.angle);
					this.socket.emit(3, null);
				} else {
					this.socket.emit(2, Math.atan2(targetY - this.pos.y, targetX - this.pos.x));
					this.socket.emit(3, Math.atan2(targetY - this.pos.y, targetX - this.pos.x));
				}
			}
		} else if (followID && players[followID]) {
			const p = players[followID];
			if (p && p.x) {
				const now = Date.now();
				if (now - p.lastUpdated > 30000 && now - this.lastRandAngleUpdate > 20000) {
					this.lastRandAngleUpdate = now;
					const randAngle = Math.random() * Math.PI * 2;
					this.socket.emit(2, randAngle);
					this.socket.emit(3, randAngle);
				} else if (!attackFollowedPlayer) {
					if (Math.pow(this.pos.x - p.x, 2) + Math.pow(this.pos.y - p.y, 2) < 20000) {
						this.socket.emit(2, p.angle);
						this.socket.emit(3, null);
					} else {
						this.socket.emit(2, Math.atan2(p.y - this.pos.y, p.x - this.pos.x));
						this.socket.emit(3, Math.atan2(p.y - this.pos.y, p.x - this.pos.x));
					}
				} else {
					this.socket.emit(2, Math.atan2(p.y - this.pos.y, p.x - this.pos.x));
					this.socket.emit(3, Math.atan2(p.y - this.pos.y, p.x - this.pos.x));
				}
			}
		} else if (goto.x && goto.y) {
			if (Math.pow(this.pos.x - goto.x, 2) + Math.pow(this.pos.y - goto.y, 2) < 40000) {
				this.socket.emit(2, 0);
				this.socket.emit(3, null);
			} else {
				this.socket.emit(2, Math.atan2(goto.y - this.pos.y, goto.x - this.pos.x));
				this.socket.emit(3, Math.atan2(goto.y - this.pos.y, goto.x - this.pos.x));
			}
			return;
		} else {
			this.socket.emit(3, null);
		}
	}
}

module.exports = Bot;