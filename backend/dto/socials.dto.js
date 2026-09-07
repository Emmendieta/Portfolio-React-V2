const { PERSISTENCE } = process.env;
import crypto from "crypto";

class SocialsDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this._id = data._id;
        this.name = data.name;
        this.url = data.url;
        this.typeSocial = data.typeSocial || "Contact";
        this.images = data.images;
        this.user = data.user;
        this.password = data.password;
        this.order = data.order;
    };
};

export default SocialsDTO;