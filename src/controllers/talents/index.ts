import { Request, Response } from "express";
import * as TalentsService from "../../services/talents";
import { Talent } from "../../models/talents";

export const getTalents = async (_: Request, res: Response) => {
  try {
    const talents = await TalentsService.getTalents();

    return res.status(200).json({
      message: "Talents found",
      data: talents,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      data: null,
    });
  }
};

export const getTalent = async (req: Request, res: Response) => {
  const id = req.query.id as string;
  const email = req.query.email as string;

  if (!id?.length && !email?.length) {
    return res.status(400).json({
      message: "Talent ID or email required.",
      data: null,
    });
  }

  try {
    const talent = await TalentsService.getTalent({ id, email });

    return res.status(200).json({
      message: "Talent found",
      data: talent,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      data: null,
    });
  }
};

export const createTalent = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    languages,
    frameworks,
    databases,
    otherSkills,
    jobHistory,
    educationHistory,
    social,
  } = req.body;

  if (!firstName?.length) {
    return res.status(400).json({
      message: "Talent first name required.",
      data: null,
    });
  }

  if (!lastName?.length) {
    return res.status(400).json({
      message: "Talent last name required.",
      data: null,
    });
  }

  if (!email?.length) {
    return res.status(400).json({
      message: "Talent email required.",
      data: null,
    });
  }

  if (!social?.linkedin?.length) {
    return res.status(400).json({
      message: "Talent linkedin required.",
      data: null,
    });
  }

  const talentToCreate: Talent = {
    firstName,
    lastName,
    email,
    languages: languages || [],
    frameworks: frameworks || [],
    databases: databases || [],
    otherSkills: otherSkills || [],
    jobHistory: jobHistory || [],
    educationHistory: educationHistory || [],
    social,
  };

  try {
    const talentCreated = await TalentsService.createTalent(talentToCreate);

    return res.status(200).json({
      message: "Talent created",
      data: talentCreated,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      data: null,
    });
  }
};

export const updateTalent = async (req: Request, res: Response) => {
  const {
    _id,
    firstName,
    lastName,
    email,
    languages,
    frameworks,
    databases,
    otherSkills,
    jobHistory,
    educationHistory,
    social,
  } = req.body;

  if (!_id?.length) {
    return res.status(400).json({
      message: "Talent ID required.",
      data: null,
    });
  }

  if (!firstName?.length) {
    return res.status(400).json({
      message: "Talent first name required.",
      data: null,
    });
  }

  if (!lastName?.length) {
    return res.status(400).json({
      message: "Talent last name required.",
      data: null,
    });
  }

  if (!email?.length) {
    return res.status(400).json({
      message: "Talent email required.",
      data: null,
    });
  }

  if (!social?.linkedin?.length) {
    return res.status(400).json({
      message: "Talent linkedin required.",
      data: null,
    });
  }

  const talentToUpdate: Talent = {
    firstName,
    lastName,
    email,
    languages: languages || [],
    frameworks: frameworks || [],
    databases: databases || [],
    otherSkills: otherSkills || [],
    jobHistory: jobHistory || [],
    educationHistory: educationHistory || [],
    social,
  };

  try {
    const talentUpdated = await TalentsService.createTalent(talentToUpdate);

    return res.status(200).json({
      message: "Talent updated",
      data: talentUpdated,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      data: null,
    });
  }
};

export const deleteTalent = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await TalentsService.deleteTalent(id);

    return res.status(200).json({
      message: "Talent deleted",
      data: null,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      data: null,
    });
  }
};
