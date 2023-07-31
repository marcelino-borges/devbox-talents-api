import { JobQuery } from "../../models/jobs/index.";
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

export const queryJobs = async (query: JobQuery, requesterUserId: string) => {
  const {
    roleName,
    employmentType,
    locationType,
    mandatorySkills,
    preferredSkills,
    seniorityLevel,
    pageSize,
    pageNumber,
  } = query;

  try {
    const requesterUser = await TalentDB.findById(requesterUserId);

    if (!requesterUser) {
      throw new Error("Could not find requester user.");
    }

    const isAdmin = requesterUser.isAdmin;

    let result: any = null;

    let resultProject: any = {};

    if (!isAdmin) {
      resultProject = {
        _id: 1,
        roleName: 1,
        employmentType: 1,
        locationType: 1,
        description: 1,
        mandatoryRequirements: 1,
        preferredRequirements: 1,
        mandatorySkills: 1,
        preferredSkills: 1,
        seniorityLevel: 1,
        createdAt: 1,
        updatedAt: 1,
      };
    } else {
      resultProject = {
        _id: 1,
        creatorId: 1,
        companyName: 1,
        roleName: 1,
        employmentType: 1,
        companyLocation: 1,
        locationType: 1,
        description: 1,
        mandatoryRequirements: 1,
        preferredRequirements: 1,
        mandatorySkills: 1,
        preferredSkills: 1,
        seniorityLevel: 1,
        createdAt: 1,
        updatedAt: 1,
      };
    }

    const orQuery = [];

    if (roleName?.length) {
      orQuery.push({
        roleName: createRegex(roleName),
      });
    }

    if (employmentType !== undefined) {
      orQuery.push({
        employmentType,
      });
    }

    if (locationType !== undefined) {
      orQuery.push({
        locationType,
      });
    }

    if (mandatorySkills?.length) {
      let mandatorySkillsAsArray = getArrayFromString(mandatorySkills);

      orQuery.push({
        mandatorySkills: getSkillElementMatch(mandatorySkillsAsArray),
      });
    }

    if (preferredSkills?.length) {
      let preferredSkillsAsArray = getArrayFromString(preferredSkills);

      orQuery.push({
        preferredSkills: getSkillElementMatch(preferredSkillsAsArray),
      });
    }

    if (seniorityLevel !== undefined) {
      orQuery.push({
        seniorityLevel,
      });
    }

    let sorting: any = {};

    if (!isAdmin) {
      sorting = {
        roleName: 1,
      };
    } else {
      sorting = {
        companyName: 1,
        roleName: 1,
      };
    }

    let basicFiltersAggregate: any[] = [
      {
        $project: resultProject,
      },
      {
        $sort: sorting,
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

    result = await TalentDB.aggregate(basicFiltersAggregate);

    return {
      jobs: result[0].items,
      total: result[0].total[0].count,
    };
  } catch (error: any) {
    throw error;
  }
};
