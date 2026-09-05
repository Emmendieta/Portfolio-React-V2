import permissionsController from "../../controllers/permissions.controller.js";
import RouterHelper from "../../helpers/router.helper.js";
import { requiredPermission } from "../../middlewares/permissions.mid.js";
import passport from "../../middlewares/passport.mid.js";

class PermissionsRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.create("/", ["public"], permissionsController.createPermission);
        this.read("/", ["public"], permissionsController.getAllPermissions);
        /* this.read("/",["public"], passport.authenticate("current", {session: false }), requirePermission('read_all_permissions'), permissionsController.getAllPersmissions); */
        this.read("/:id", ["public"], permissionsController.getPermissionById);
        this.read("/pag/paginate", ["public"], permissionsController.getPermissionsPaginate);
        this.read("/filtOne/filter", ["public"], permissionsController.getOnePermissionByFilter);
        this.read("/filt/filter", ["public"], permissionsController.getPermissionsByFilter);
        this.update("/:id", ["public"], permissionsController.updatePermissionById);
        this.destroy("/:id", ["public"], permissionsController.deletePermissionById);
    };
};

const permissionsRouter = (new PermissionsRouter()).getRouter();

export default permissionsRouter;
