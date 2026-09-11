import { permissionsRepository } from "../repositories/repository.js";
import Service from "./service.js";

class PermissionsService extends Service {
    constructor() { super(permissionsRepository); };
};

const permissionsService = new PermissionsService();

export default permissionsService;