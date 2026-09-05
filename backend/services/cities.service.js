import { citiesRepository } from "../repositories/repository.js";
import Service from "./service.js";

class CitiesService extends Service {
    constructor() { super(citiesRepository); }
};

const citiesService = new CitiesService();

export default citiesService;