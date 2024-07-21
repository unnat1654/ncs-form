import formModel from "../models/formModel.js";

export const submitResponseController = async (req, res) => {
    try {
        const { formId, userResponse } = req.body;
        if (!formId) {
            return res.status(404).send({
                success: false,
                message: "Form id missing",
            })
        }
        const form = await formModel.findByIdAndUpdate(formId, { $push: { responses: userResponse } }, { new: true });
        if (!form) {
            return res.status(404).send({
                success: false,
                message: "Form not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Form submitted successfully",
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error while submitting form",
        })
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