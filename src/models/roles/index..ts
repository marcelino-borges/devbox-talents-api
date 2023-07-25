import { Schema, Types, model } from "mongoose";
import { EmploymentType, LocationType, Skill, skillSchema } from "../talents";

export interface Job {
  _id?: string;
  creatorId: any;
  companyName: string;
  roleName: string;
  employmentType: EmploymentType;
  companyLocation: string;
  locationType: LocationType;
  description: string;
  mandatoryRequirements: string;
  preferredRequirements: string;
  mandatorySkills: Skill[];
  preferredSkills: Skill[];
  seniorityLevel: SeniorityLevel;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum SeniorityLevel {
  INTERN = 0,
  TREINEE = 1,
  JUNIOR = 2,
  MID = 3,
  SENIOR = 4,
  LEAD = 5,
  MANAGER = 6,
  DIRECTOR = 7,
  CLEVEL = 8,
}

const jobSchema = new Schema<Job>(
  {
    creatorId: {
      type: Types.ObjectId,
      required: true,
      ref: "talents",
    },
    companyName: { type: String, required: true },
    roleName: { type: String, required: true },
    employmentType: { type: Number, required: true },
    companyLocation: { type: String, required: true },
    locationType: { type: Number, required: true },
    description: { type: String, required: true },
    mandatoryRequirements: { type: String, required: true },
    preferredRequirements: { type: String, required: true },
    mandatorySkills: {
      type: [skillSchema],
      default: [],
    },
    preferredSkills: {
      type: [skillSchema],
      default: [],
    },
    seniorityLevel: { type: Number, required: true },
  },
  { timestamps: true }
);

jobSchema.index({ email: 1, creatorId: 1 });

export default model<Job>("jobs", jobSchema);
