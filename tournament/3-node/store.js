const fs = require("fs/promises");
const path = require("path");
const EventEmitter = require("events");

const FILE = path.join(__dirname, "data", "teams.json");

class Store extends EventEmitter {
  async all() {
    try {
      const data = await fs.readFile(FILE, "utf8");
      return JSON.parse(data || "[]");
    } catch {
      return [];
    }
  }

  async find(id) {
    const list = await this.all();
    return list.find(x => x.id === Number(id));
  }

  async add(team) {
    const list = await this.all();
    const rec = { id: Date.now(), points: 0, status: "Scheduled", ...team };
    list.push(rec);
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
    this.emit("team:added", rec);
    return rec;
  }

  async update(id, updates) {
    const list = await this.all();
    const idx = list.findIndex(x => x.id === Number(id));
    if (idx < 0) return null;
    list[idx] = { ...list[idx], ...updates, id: list[idx].id };
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
    this.emit("team:updated", list[idx]);
    return list[idx];
  }

  async remove(id) {
    let list = await this.all();
    const target = list.find(x => x.id === Number(id));
    if (!target) return false;
    list = list.filter(x => x.id !== Number(id));
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
    this.emit("team:deleted", target);
    return true;
  }
}

module.exports = new Store();
