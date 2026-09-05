import { categoriesRepository } from "../repositories/repository.js";
import Service from "./service.js";

class CategoriesService extends Service {
    constructor() { super(categoriesRepository); };
};

const categoriesService = new CategoriesService();
export default categoriesService;