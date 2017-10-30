'use strict';

class SkycapUser {
  constructor(json) {
    this.json = json;

    this.init();
  }

  init() {
    if (this.json) {
      this.data = this.json.data;
    }
  }

  isLoggedIn() {
    return this.id !== undefined;
  }

  get id() {
    return this.json.id;
  }

  get email() {
    return this.data.email;
  }

  toJSON() {
    let json = this.json;

    delete json.password;

    return json;
  }
}

module.exports = SkycapUser;
