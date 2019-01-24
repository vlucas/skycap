'use strict';

class SkycapUser {
  constructor(json) {
    delete json.password;

    this.json = json;

    this.init();
  }

  init() {
    if (this.json) {
      this.data = this.json;
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

  get name() {
    return this.data.name;
  }

  get username() {
    return this.data.username;
  }

  get is_admin() {
    return this.data.is_admin;
  }

  get profileData() {
    return this.data.profileData;
  }

  get dt_created() {
    return this.data.dt_created;
  }

  get dt_updated() {
    return this.data.dt_updated;
  }

  toJSON() {
    let json = this.json;

    return json;
  }
}

module.exports = SkycapUser;
