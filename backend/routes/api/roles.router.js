import rolesController from "../../controllers/roles.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class RolesRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], rolesController.createRole);
        this.read("/", ["public"], rolesController.getAllRoles);
        this.read("/:id", ["public"], rolesController.getRoleById);
        this.read("/search/paginate", ["public"], rolesController.getRolesPaginatePopulate);
        this.read("/filtOne/filter", ["public"], rolesController.getOneRoleByFilter);
        this.read("/all/populate", ["public"], rolesController.getRolesAndPopulate);
        this.read("/:id/populate", ["public"], rolesController.getOneRoleByIdAndPopualte);
        this.read("/filt/filter", ["public"], rolesController.getOneRoleByFilter);
        this.update("/:id", ["public"], rolesController.updateRoleById);
        this.destroy("/:id", ["public"], rolesController.deleteRoleById);
    };
};

const rolesRouter = (new RolesRouter()).getRouter();

export default rolesRouter;