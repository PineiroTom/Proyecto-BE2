import { userModel } from '../models/userModel.js';
import UserDTO from './dto/userDTO.js';

export default class UserDAO {
    async getUsers() {
        const users = await userModel.find();
        return users.map(user => new UserDTO(user));
    }

    async getUserById(id) {
        const user = await userModel.findById(id);
        return new UserDTO(user);
    }

    async createUser(userData) {
        const newUser = await userModel.create(userData);
        return new UserDTO(newUser);
    }

    async updateUser(id, userData) {
        const updatedUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
        return new UserDTO(updatedUser);
    }

    async deleteUser(id) {
        await userModel.findByIdAndDelete(id);
    }
}