import formModel from "../models/formModel.js";

export const submitResponseController = async (req, res) => {
    try {
        const {_id}=req.user;
        const { formId, userResponse } = req.body;
        if (!formId) {
            return res.status(404).send({
                success: false,
                message: "Form id missing",
            });
        }

        const form = await formModel.findByIdAndUpdate(formId, { $push: { responses: {...userResponse,mario_id:_id} } });
        if (!form)
            return res.status(404).send({
                success: false,
                message: "Form not found"
            });
            
        res.status(200).send({
            success: true,
            message: "Form submitted successfully",
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error while submitting form",
        });
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
            });
        }

        const allKeys = Array.from(
            formResponses.responses.reduce((keys, obj) => {
                Object.keys(obj).forEach(key => keys.add(key));
                return keys;
            }, new Set())
        );
        const normalizedResponses = formResponses.responses.map(obj => {
            const normalized = {};
            allKeys.forEach(key => {
                normalized[key] = obj[key] || '';
            });
            return normalized;
        });
        res.setHeader('Content-Disposition', 'attachment; filename="responses.xlsx"');
        res.xls(`Responses_${formId}.xlsx`, normalizedResponses);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error while Fetching repsonses",
        })
    }
}