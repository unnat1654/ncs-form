import formModel from "../models/formModel.js";

export const submitResponseController = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
    }
};

export const getResponsesController = async (req, res) => {
    const { formId } = req.params;
    try {
        const formResponses = await formModel.findById(formId).select("responses");
        if (!formResponses || !formResponses.responses.length) {
            return res.status(404).send({
                success: false,
                message: "Form Responses not found",
            })

        }
        res.xls(`Responses_${formId}.xlsx`, formResponses.responses);
    } catch (error) {
        console.error(error);
    }
}