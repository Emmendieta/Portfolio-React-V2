export const lookup = (from, localField, foreignFiled = "_id", as = from) => ({
    $lookup: { from, localField, foreignFiled, as }
});