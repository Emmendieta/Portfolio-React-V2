import { proyectsRepository } from "../repositories/repository.js";
import Service from "./service.js";

class ProyectsService extends Service {
    constructor() { super(proyectsRepository); };
};

const proyectsService = new ProyectsService();

export default proyectsService;