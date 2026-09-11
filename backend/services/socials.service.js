import { socialsRepository } from "../repositories/repository.js";
import Service from "./service.js";

class SocialsService extends Service {
    constructor() { super(socialsRepository); };
};

const socialsService = new SocialsService();

export default socialsService;