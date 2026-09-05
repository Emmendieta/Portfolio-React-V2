import { provincesRepository } from "../repositories/repository.js";
import Service from "./service.js";

class ProvincesService extends Service {
    constructor() { super(provincesRepository); };
};

const provincesService = new ProvincesService();

export default provincesService;