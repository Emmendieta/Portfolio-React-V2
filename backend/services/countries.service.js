import { countriesRepository } from "../repositories/repository.js";
import Service from "./service.js";

class CountriesService extends Service {
    constructor() { super(countriesRepository); };
};

const countriesService = new CountriesService();

export default countriesService;