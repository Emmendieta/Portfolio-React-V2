import { rolesRepository } from "../repositories/repository.js";
import Service from "./service.js";

class RolesService extends Service {
    constructor() { super(rolesRepository); };
};

const rolesService = new RolesService();

export default rolesService;