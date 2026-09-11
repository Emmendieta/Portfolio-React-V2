import { connect } from "mongoose";

const dbConnect = async (link) => {
    try {
        await connect(link);
        console.log(
            "Mongo URI:",
            link.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@")
        );

        console.warn("Connect To MongoDB");
    } catch (error) {
        throw new Error(`Error connectiong MongoDB: ${error.message}`)
    }
};

export default dbConnect;