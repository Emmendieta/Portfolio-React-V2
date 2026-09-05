import { connect } from "mongoose";

const dbConnect = async (link) => {
    try {
        await connect(link);
        console.warn("Connect To MongoDB");
    } catch (error) {
        throw new Error(`Error connectiong MongoDB: ${error.message}`)
    }
};

export default dbConnect;