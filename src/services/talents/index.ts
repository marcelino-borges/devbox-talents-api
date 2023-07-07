import TalentDB, { Talent, TalentQuery } from "../../models/talents";

export const queryTalents = async (
  pageNumber: number,
  pageSize: number,
  query?: string
) => {
  try {
    let result: any = null;

    if (!query) {
      result = await TalentDB.aggregate([
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
          },
        },
        {
          $sort: {
            firstName: 1,
            lastName: 1,
          },
        },
        {
          $facet: {
            items: [
              { $skip: pageNumber > 0 ? (pageNumber - 1) * pageSize : 0 },
              { $limit: pageSize },
            ],
            total: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);
    } else {
      result = await TalentDB.aggregate([
        {
          $match: {
            $or: [
              { firstName: { $regex: query, $options: "i" } },
              { lastName: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } },
              { "languages.label": { $regex: query, $options: "i" } },
              { "languages.value": { $regex: query, $options: "i" } },
              { "jobHistory.companyName": { $regex: query, $options: "i" } },
              { "jobHistory.roleName": { $regex: query, $options: "i" } },
              { "frameworks.label": { $regex: query, $options: "i" } },
              { "frameworks.value": { $regex: query, $options: "i" } },
              { "databases.label": { $regex: query, $options: "i" } },
              { "databases.value": { $regex: query, $options: "i" } },
              { "otherSkills.label": { $regex: query, $options: "i" } },
              { "otherSkills.value": { $regex: query, $options: "i" } },
              {
                "educationHistory.institution": {
                  $regex: query,
                  $options: "i",
                },
              },
              { "educationHistory.course": { $regex: query, $options: "i" } },
              { "educationHistory.course": { $regex: query, $options: "i" } },
            ],
          },
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
          },
        },
        {
          $sort: {
            firstName: 1,
            lastName: 1,
          },
        },
        {
          $facet: {
            items: [
              { $skip: pageNumber > 0 ? (pageNumber - 1) * pageSize : 0 },
              { $limit: pageSize },
            ],
            total: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);
    }

    return {
      talents: result[0].items,
      total: result[0].total[0].count,
    };
  } catch (error: any) {
    return {
      talents: [],
      total: 0,
    };
  }
};

export const getTalents = async () => {
  const found = await TalentDB.find();

  if (!found) {
    throw new Error("Could not find talents.");
  }

  return found;
};

export const getTalent = async ({ id, email, authId }: TalentQuery) => {
  const query = [];

  if (id) {
    query.push({ _id: id });
  }

  if (email) {
    query.push({ email });
  }

  if (authId) {
    query.push({ authId });
  }

  const found = await TalentDB.findOne({
    $or: query,
  });

  if (!found) {
    throw new Error("Could not find this talent.");
  }

  return found;
};

export const createTalent = async (talent: Talent) => {
  const created = await TalentDB.create(talent);

  if (!created) {
    throw new Error("Could not create the talent.");
  }

  return created;
};

export const updateTalent = async (talent: Talent) => {
  const updated = await TalentDB.findOneAndUpdate(
    { _id: talent._id, email: talent.email },
    talent,
    {
      new: true,
    }
  );

  if (!updated) {
    throw new Error("Could not update the talent.");
  }

  return updated;
};

export const deleteTalent = async (id: string) => {
  const deleted = await TalentDB.findByIdAndDelete(id);

  if (!deleted) {
    throw new Error("Could not delete the talent.");
  }

  return deleted;
};
