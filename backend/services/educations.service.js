import { educationsRepository } from "../repositories/repository.js";
import Service from "./service.js";

class EducationsService extends Service {
    constructor() { super(educationsRepository); };
};

const educationsService = new EducationsService();

export default educationsService;