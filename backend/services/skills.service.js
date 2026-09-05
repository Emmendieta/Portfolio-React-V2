import { skillsRepository } from "../repositories/repository.js";
import Service from "./service.js";

class SkillsService extends Service {
    constructor() { super(skillsRepository); };
};

const skillsService = new SkillsService();

export default skillsService;