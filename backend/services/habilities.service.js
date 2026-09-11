import { habilitiesRepository } from "../repositories/repository.js";
import Service from "./service.js";

class HabilitiesService extends Service {
    constructor() { super(habilitiesRepository); };
};

const habilitiesService = new HabilitiesService();

export default habilitiesService;