const PREFIX = "fintjam_";

const Storage = {
  get(key) {
    const data = localStorage.getItem(PREFIX + key);
    return data ? JSON.parse(data) : null;
  },
  set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },

  // User CRUD
  getUsers() {
    return this.get("users") || [];
  },
  saveUser(user) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.set("users", users);
  },
  getUserById(id) {
    return this.getUsers().find((u) => u.id === id);
  },

  // Transaction CRUD
  getTransactions(userId) {
    const all = this.get("transactions") || [];
    return all.filter((t) => t.userId === userId);
  },
  saveTransaction(transaction) {
    const all = this.get("transactions") || [];
    if (!transaction.id) transaction.id = crypto.randomUUID();
    all.push(transaction);
    this.set("transactions", all);
    return transaction;
  },

  // Session
  setCurrentUser(userId) {
    this.set("session", userId);
  },
  getCurrentUser() {
    const userId = this.get("session");
    if (!userId) return null;
    return this.getUserById(userId);
  },
  logout() {
    localStorage.removeItem(PREFIX + "session");
  },
};

const Utils = {
  formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  },
};
