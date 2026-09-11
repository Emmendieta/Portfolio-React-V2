import { config } from "dotenv";
import argvsHelper from "./argvs.helpler.js";

const mode = argvsHelper.mode;
const path = `.env.${mode}`;

config({ path });

const env = {
    PORT: process.env.PORT,
    LINK_DB: process.env.LINK_DB,
    SECRET: process.SECRET
};

export default env;