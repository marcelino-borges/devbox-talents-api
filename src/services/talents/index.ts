import TalentDB, {
  Talent,
  GetTalentQuery,
  TalentSearchQuery,
} from "../../models/talents";

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

    const createRegex = (string: string) => ({ $regex: string, $options: "i" });
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

    const andOtherFields = [];

    if (name?.length) {
      andOtherFields.push({
        firstName: name,
      });
      andOtherFields.push({
        lastName: name,
      });
    }

    if (email?.length) {
      andOtherFields.push({
        email,
      });
    }

    const getArrayFromString = (originalString: string) => {
      return originalString.replace(/\s/, "").split(",");
    };
    if (languages?.length) {
      let languagesAsArray = getArrayFromString(languages);

      andOtherFields.push({
        languages: { $all: languagesAsArray },
      });
    }

    if (frameworks?.length) {
      let frameworksAsArray = getArrayFromString(frameworks);

      andOtherFields.push({
        frameworks: { $all: frameworksAsArray },
      });
    }

    if (databases?.length) {
      let databasesAsArray = getArrayFromString(databases);

      andOtherFields.push({
        databases: { $all: databasesAsArray },
      });
    }

    if (otherSkills?.length) {
      let otherSkillsAsArray = getArrayFromString(otherSkills);

      andOtherFields.push({
        otherSkills: { $all: otherSkillsAsArray },
      });
    }

    result = await TalentDB.aggregate([
      {
        $match: {
          $and: [{ $or: orFreeText }, ...andOtherFields],
        },
      },
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
    ]);

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
