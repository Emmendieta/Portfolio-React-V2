import multer from "multer";
import RouterHepler from "../../helpers/router.helper.js";
import categoriesController from "../../controllers/categories.controller.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

class CategoriesRouter extends RouterHepler {
    constructor() {
        super();
        this.init();
    };
    init = () => {
        this.create("/", ["public"], upload.array("images"), categoriesController.createCategory);
        this.create("/many", ["public"], categoriesController.createManyCategories);
        this.read("/", ["public"], categoriesController.getAllCategories);
        this.read("/:id", ["public"], categoriesController.getCategoryById);
        this.read("/filtOne/filter", ["public"], categoriesController.getCategoryByFilter);
        this.read("/filt/filter", ["public"], categoriesController.getCategoriesByFilter);
        this.update("/reorder", ["public"], categoriesController.updateCategoriesOrder);
        this.update("/:id", ["public"], upload.array("images"), categoriesController.updateCategoryById);
        this.destroy("/:id", ["public"], categoriesController.deleteCategoryById);
    };
};

const categoriesRouter = (new CategoriesRouter()).getRouter();

export default categoriesRouter;