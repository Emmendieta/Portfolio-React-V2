const { PERSISTENCE } = process.env;
import crypto from "crypto";

class SKillsDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this._id = data._id;
        this.name = data.name instanceof Map ? data.name: new Map(Object.entries(data.name || {}));
        this.percent = data.percent;
        this.images = data.images;
        this.type = data.type;
        this.order = data.order;
    };
};

export default SKillsDTO;