const { PERSISTENCE } = process.env;
import crypto from "crypto";

class ProyectsDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this._id = data._id;
        this.name = data.name instanceof Map ? data.name: new Map(Object.entries(data.name || {}));
        this.dateStart= data.dateStart;
        this.dateEnd = data.dateEnd;
        this.company = data.company instanceof Map ? data.company: new Map(Object.entries(data.company || {}));
        this.linkProyect = data.linkProyect;
        this.linkCompany = data.linkCompany;
        this.description = data.description instanceof Map ? data.description: new Map(Object.entries(data.description || {}));
        this.skills = data.skills || [];
        this.categories = data.categories || [];
        this.responsibilities = data.responsibilities || [];
        this.images = data.images || [];
        this.order = data.order;
    };
};

export default ProyectsDTO;