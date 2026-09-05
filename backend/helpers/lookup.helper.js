export const lookup = (from, localField, foreignField = "_id", as = from) => ({
    $lookup: { from, localField, foreignField, as }
});