const { PERSISTENCE } = process.env;
import crypto from "crypto";

class UsersDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this._id = data._id;
        this.user = data.user;
        this.email = data.email;
        this.password = data.password;
        this.active = data.active;
        this.roles = data.roles;
        this.people = data.people;
        this.extraPermission = data.extraPermission;
        this.order = data.order;
    };
};

export default UsersDTO;