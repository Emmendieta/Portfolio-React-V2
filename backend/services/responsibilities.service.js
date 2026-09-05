import { responsibilitiesRepository } from "../repositories/repository.js";
import Service from "./service.js";

class ResponsibilitiesService extends Service {
    constructor() { super(responsibilitiesRepository); };
};

const responsibilitiesService = new ResponsibilitiesService();

export default responsibilitiesService;