const { PERSISTENCE } = process.env;
import crypto from "crypto";

class EducationsDTO {
    constructor(data) {
        if(PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
            this.createAt = new Date();
            this.updateAt = new Date();
        };
        this._id = data._id;
        this.institutionName = data.institutionName instanceof Map ? data.institutionName: new Map(Object.entries(data.institutionName || {}));
        this.title = data.title instanceof Map ? data.title: new Map(Object.entries(data.title || {}));
        this.dateStart = data.dateStart;
        this.dateEnd = data.dateEnd;
        this.linkInstitution = data.linkInstitution;
        this.images = data.images;
        this.linkCertificate = data.linkCertificate;
        this.finished = data.finished;
        this.typeEducation = data.typeEducation;
        this.description = data.description instanceof Map ? data.description: new Map(Object.entries(data.description || {}));
        this.habilities = data.habilities || [];
        this.order = data.order;
    };
};

export default EducationsDTO;