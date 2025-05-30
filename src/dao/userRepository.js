class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createUser(user) {
    return await this.dao.createUser(user);
  }

  async getUserById(id) {
    return await this.dao.getUserById(id);
  }

  async getUserByEmail(email) {
    return await this.dao.getUserByEmail(email);
  }

  async updateUser(id, user) {
    return await this.dao.updateUser(id, user);
  }

  async deleteUser(id) {
    return await this.dao.deleteUser(id);
  }
}

module.exports = UserRepository;