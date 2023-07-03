import { Request, Response } from "express";
import * as TalentsService from "../services/talents";
import { Talent } from "../models/talents";

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
  const id = req.params.id;
  const email = req.params.email;

  if (!id?.length && !email?.length) {
    return res.status(400).json({
      message: "Talent ID or email required.",
      data: null,
    });
  }

  try {
    const talents = await TalentsService.getTalent({ id, email });

    return res.status(200).json({
      message: "Talent found",
      data: talents,
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
    skills,
    jobHistory,
    personalWebsite,
    linkedin,
    instagram,
    git,
  } = req.body;
  let skillsNormalized = skills;

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

  if (!skillsNormalized) {
    skillsNormalized = [];
  }

  const talentToCreate: Talent = {
    firstName,
    lastName,
    email,
    skills: skillsNormalized,
    jobHistory,
    personalWebsite,
    linkedin,
    instagram,
    git,
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
    skills,
    jobHistory,
    personalWebsite,
    linkedin,
    instagram,
    git,
  } = req.body;
  let skillsNormalized = skills;

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

  if (!skillsNormalized) {
    skillsNormalized = [];
  }

  const talentToCreate: Talent = {
    _id,
    firstName,
    lastName,
    email,
    skills: skillsNormalized,
    jobHistory: jobHistory || "",
    personalWebsite: personalWebsite,
    linkedin: linkedin || "",
    instagram: instagram || "",
    git: git || "",
  };

  try {
    const talentUpdated = await TalentsService.createTalent(talentToCreate);

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
