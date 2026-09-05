import { usersRepository } from "../repositories/repository.js";

const populateUser = async (userId) => {
    const populateFields = ["roles", "roles.permissions", "extraPermission", "people"];
    const user = await usersRepository.manager.readByIdAndPopulate(userId, populateFields);
    return user;
};

export default populateUser;