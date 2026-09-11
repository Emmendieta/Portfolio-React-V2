import { worksRepository } from "../repositories/repository.js";
import Service from "./service.js";

class WorksService extends Service {
    constructor() { super(worksRepository); };
};

const worksService = new WorksService();

export default worksService;