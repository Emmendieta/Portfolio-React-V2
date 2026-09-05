import { usersRepository } from "../repositories/repository.js";
import Service from "./service.js";

class UsersService extends Service {
    constructor() { super(usersRepository); };
};

const usersService = new UsersService();

export default usersService;