import formModel from "../models/formModel.js";
import questionModel from "../models/questionModel.js";

export const createFormController = async (req, res) => {
  try {
    const { name, description, questions } = req.body;

    if (!name || !description) {
      return res.status(404).send({
        success: false,
        message: "form name or description missing"
      })
    }
    //check question availabilty
    const existingform = await formModel.findOne({ name });
    if (existingform) {
      return res.status(409).send({
        success: false,
        message: "form name is already in use"
      })
    }
    // create questions
    await questionModel.insertMany(questions, { runValidators: true });

    const questionIds = questions.map(question => question._id);

    // create form
    const form = await formModel.create({
      name,
      description,
      questions: questionIds,
    });

    res.status(201).json({
      success: true,
      message: "Form Created Successfully"
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating form", error });
  }
};

export const getAllFormsController = async (req, res) => {
  try {
    const forms = await formModel
      .find({})
      .select({ _id: 1, name: 1, description: 1});
    if (!forms) {
      return res.status(404).send({
        success: false,
        message: "Forms not found"
      })
    }
    res.status(200).send({
      success: true,
      message: "forms fetched successfully",
      forms,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error while getting all forms", error });
  }
};

export const getFormController = async (req, res) => {
  try {
    const { formId } = req.params;
    
    const form = await formModel
      .findById(formId)
      .select({ _id: 1, name: 1, description: 1, questions: 1}).populate("questions");
    if (!form) {
      return res.status(404).send({
        success: false,
        message: "form not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "form fetched successfully",
      form
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting form",
      error,
    });
  }
};

export const deleteFormController = async (req, res) => {
  try {
    const { formId } = req.body;
    const form = await formModel.findByIdAndDelete(formId);
    if (!form) {
      return res.status(404).send({
        success: false,
        message: "form not found for deletion",
      });
    }
    const { deletedCount } = await questionModel.deleteMany({
      _id: { $in: form.questions },
    });
    res.status(204).send({
      success: true,
      message: `The form and ${deletedCount} associated questions were deleted.`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting form",
      error,
    });
  }
};
