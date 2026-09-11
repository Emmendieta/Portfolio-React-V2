import multer from "multer";
import usersController from "../../controllers/users.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

//Configuracion Multer:
const storage = multer.memoryStorage();
const upload = multer({ storage });

class UsersRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], upload.array("images"), usersController.createUser);
        this.read("/", ["public"], usersController.getAllUsers);
        this.read("/:id", ["public"], usersController.getUserById);
        this.read("/search/paginate", ["public"], usersController.getUsersPaginatePopulate);
        this.read("/filtOne/filter", ["public"], usersController.getOneUserByFilter);
        this.read("/all/populate", ["public"], usersController.getAllUsersPopulate);
        this.read("/:id/populate", ["public"], usersController.getOneUserByIdPopulate);
        this.read("/filt/filter", ["public"], usersController.getUsersByFilter);
        this.update("/:id", ["public"], upload.array("images"), usersController.updateUserById);
        this.destroy("/:id", ["public"], usersController.deleteUserById);
    };
};

const usersRouter = (new UsersRouter()).getRouter();

export default usersRouter;