class CurriculumController {
    constructor() {

    };

    createCurriculum = async (req, res) => {
        try {
            const data = req.body;
            console.log(data);
            if(!data) throw new Error("Error: Missing the information to create the Curriculum PDF!");
        } catch (error) {
            return res.json500(error.message);
        }
    };
};

const curriculumController = new CurriculumController();

export default curriculumController;