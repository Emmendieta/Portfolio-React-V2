import { continentsRepository } from "../repositories/repository.js";
import Service from "./service.js";

class ContinentsService extends Service {
    constructor() { super(continentsRepository); };
};

const continentsService = new ContinentsService()

export default continentsService;