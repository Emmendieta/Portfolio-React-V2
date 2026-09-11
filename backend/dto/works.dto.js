const { PERSISTENCE } = process.env;
import crypto from "crypto";

class WorksDTO {
    constructor(data) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this._id = data._id;
        this.jobTitle = data.jobTitle instanceof Map ? data.jobTitle: new Map(Object.entries(data.jobTitle || {}));
        this.dateStart = data.dateStart;
        this.dateEnd = data.dateEnd;
        this.company = data.company instanceof Map ? data.company: new Map(Object.entries(data.company || {}));
        this.linkCompany = data.linkCompany;
        this.finished = data.finished;
        this.description = data.description;
        this.images = data.images;
        this.responsibilities = data.responsibilities || [];
        this.order = data.order;
    };
};

export default WorksDTO;