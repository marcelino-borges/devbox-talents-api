import { Request, Response } from "express";
import * as TalentsService from "../../services/talents";
import { Talent } from "../../models/talents";

export const queryTalents = async (req: Request, res: Response) => {
  const { q: query, pageNumber, pageSize } = req.query;

  try {
    const talents = await TalentsService.queryTalents(
      pageNumber !== undefined && !isNaN(Number(pageNumber))
        ? Number(pageNumber)
        : 1,
      pageSize !== undefined && !isNaN(Number(pageSize))
        ? Number(pageSize)
        : 10,
      query as string
    );

    return res.status(200).json({
      message: "Busca realizada com sucesso.",
      data: talents,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      data: null,
    });
  }
};

export const getTalents = async (_: Request, res: Response) => {
  try {
    const talents = await TalentsService.getTalents();

    return res.status(200).json({
      message: "Talentos localizados com sucesso.",
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
  const authId = req.query.authId as string;

  if (!id?.length && !email?.length && !authId?.length) {
    return res.status(400).json({
      message: "ID, e-mail ou authId obrigatório.",
      data: null,
    });
  }

  try {
    const talent = await TalentsService.getTalent({ id, email, authId });

    return res.status(200).json({
      message: "Talento localizado.",
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
    authId,
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
      message: "Nome obrigatório.",
      data: null,
    });
  }

  if (!lastName?.length) {
    return res.status(400).json({
      message: "Sobrenome obrigatório.",
      data: null,
    });
  }

  if (!email?.length) {
    return res.status(400).json({
      message: "E-mail obrigatório.",
      data: null,
    });
  }

  if (!social?.linkedin?.length) {
    return res.status(400).json({
      message: "LinkedIn obrigatório.",
      data: null,
    });
  }

  const talentToCreate: Talent = {
    authId,
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
      message: "Talento criado.",
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
    authId,
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
      message: "ID do talento obrigatório.",
      data: null,
    });
  }

  if (!firstName?.length) {
    return res.status(400).json({
      message: "Nome obrigatório.",
      data: null,
    });
  }

  if (!lastName?.length) {
    return res.status(400).json({
      message: "Sobrenome obrigatório.",
      data: null,
    });
  }

  if (!email?.length) {
    return res.status(400).json({
      message: "E-mail obrigatório.",
      data: null,
    });
  }

  if (!social?.linkedin?.length) {
    return res.status(400).json({
      message: "LinkedIn obrigatório",
      data: null,
    });
  }

  const talentToUpdate: Talent = {
    firstName,
    lastName,
    email,
    authId,
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
      message: "Talento atualizado.",
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
      message: "Talento deletado.",
      data: null,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      data: null,
    });
  }
};
