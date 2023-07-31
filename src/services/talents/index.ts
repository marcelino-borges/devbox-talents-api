import TalentDB, {
  Talent,
  GetTalentQuery,
  TalentSearchQuery,
} from "../../models/talents";
import {
  createRegex,
  getArrayFromString,
  getSkillElementMatch,
} from "../../utils";

export const queryTalents = async (query: TalentSearchQuery) => {
  const {
    pageNumber,
    pageSize,
    freeText,
    name,
    email,
    languages,
    frameworks,
    databases,
    otherSkills,
  } = query;

  try {
    let result: any = null;
    const project = {
      firstName: 1,
      lastName: 1,
      email: 1,
      languages: 1,
      frameworks: 1,
      databases: 1,
      otherSkills: 1,
    };

    let orFreeText: any[] = [];

    if (freeText?.length) {
      const freeTextRegex = createRegex(freeText);

      let fields = [
        { firstName: freeTextRegex },
        { lastName: freeTextRegex },
        { email: freeTextRegex },
        { "languages.label": freeTextRegex },
        { "languages.value": freeTextRegex },
        { "jobHistory.companyName": freeTextRegex },
        { "jobHistory.roleName": freeTextRegex },
        { "frameworks.label": freeTextRegex },
        { "frameworks.value": freeTextRegex },
        { "databases.label": freeTextRegex },
        { "databases.value": freeTextRegex },
        { "otherSkills.label": freeTextRegex },
        { "otherSkills.value": freeTextRegex },
        {
          "educationHistory.institution": freeTextRegex,
        },
        { "educationHistory.course": freeTextRegex },
        { "educationHistory.course": freeTextRegex },
        {
          isAdmin: false,
        },
        {
          isAdmin: undefined,
        },
      ];

      orFreeText = [...fields];
    }

    const orOtherFields = [];
    const orNames = [];

    if (name?.length) {
      orNames.push({
        firstName: createRegex(name),
      });
      orNames.push({
        lastName: createRegex(name),
      });
    }

    if (email?.length) {
      orOtherFields.push({
        email: createRegex(email),
      });
    }

    if (languages?.length) {
      let languagesAsArray = getArrayFromString(languages);

      orOtherFields.push({
        languages: getSkillElementMatch(languagesAsArray),
      });
    }

    if (frameworks?.length) {
      let frameworksAsArray = getArrayFromString(frameworks);

      orOtherFields.push({
        frameworks: getSkillElementMatch(frameworksAsArray),
      });
    }

    if (databases?.length) {
      let databasesAsArray = getArrayFromString(databases);

      orOtherFields.push({
        databases: getSkillElementMatch(databasesAsArray),
      });
    }

    if (otherSkills?.length) {
      let otherSkillsAsArray = getArrayFromString(otherSkills);

      orOtherFields.push({
        otherSkills: getSkillElementMatch(otherSkillsAsArray),
      });
    }

    let and: any = [];

    if (orFreeText?.length) and = [{ $or: orFreeText }];
    if (orNames?.length) and = [...and, { $or: orNames }];
    if (orOtherFields?.length) and = [...and, ...orOtherFields];

    let basicFilters: any[] = [
      {
        $project: project,
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
            { $skip: pageNumber! > 0 ? (pageNumber! - 1) * pageSize! : 0 },
            { $limit: pageSize! },
          ],
          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    result = await TalentDB.aggregate([
      ...(and.length
        ? [
            {
              $match: {
                $and: and,
              },
            },
          ]
        : []),
      ...basicFilters,
    ]);

    return {
      talents: result[0].items,
      total: result[0].total[0].count,
    };
  } catch (error: any) {
    throw error;
  }
};

export const getTalents = async () => {
  const found = await TalentDB.find();

  if (!found) {
    throw new Error("Could not find talents.");
  }

  return found;
};

export const getTalent = async ({ id, email, authId }: GetTalentQuery) => {
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
