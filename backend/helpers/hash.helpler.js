import { genSaltSync, hashSync, compareSync } from "bcrypt";
import crypto from "crypto";

const createHash = (password) => hashSync(password, genSaltSync(15));
const compareHash = (password, passwordDB) => {
    return compareSync(password, passwordDB);
};

///Verify Images:

const generateFileImageHash = (buffer) => {
    return crypto.createHash("sha256").update(buffer).digest("hex");
};

export { createHash, compareHash, generateFileImageHash };