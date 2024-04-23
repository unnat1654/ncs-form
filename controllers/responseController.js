import formModel from "../models/formModel";

export const submitResponseController=async(req,res)=>{
    try {
        
    } catch (error) {
        console.error(error);
    }
};

export const getResponsesController=async(req,res)=>{
    const {formId} = req.params;
    try {
        const formResponses = await formModel.findById(formId).select("responses");
        if(formResponses && formResponses.responses.length){
            res.xls(`Responses_${formId}.xlsx`,formResponses.responses);
        }
        else {
            res.status(404).send({
                success:false,
                message:"Form Responses not found",
            })
        }
    } catch (error) {
        console.error(error);
    }
}