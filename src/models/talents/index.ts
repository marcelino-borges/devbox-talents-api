import { Schema, model } from "mongoose";

export interface Talent {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  jobHistory: string;
  personalWebsite: string;
  linkedin: string;
  instagram: string;
  git: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// export interface Job {
//   companyName: string;
//   roleName: string;
//   employmentType: EmploymentType;
//   location: string;
//   locationType: LocationType;
//   currentEmployment: boolean;
//   startData: Date;
//   endDate: Date;
//   description: string;
//   skills: string[];
// }

// export enum EmploymentType {
//   FULL_TIME,
//   PART_TIME,
//   SELF_EMPLOYED,
//   FREELANCE,
//   CONTRACT,
//   INTERNSHIP,
//   APPRENTICESHIP,
// }

// export enum LocationType {
//   REMOTE,
//   ONSITE,
//   HYBRID,
// }

export interface TalentQuery {
  id?: string;
  email?: string;
}

const talentSchema = new Schema<Talent>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    skills: { type: [String], default: [] },
    jobHistory: { type: String, default: "" },
    personalWebsite: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },
    git: { type: String, default: "" },
  },
  { timestamps: true }
);

talentSchema.index({ email: 1 });

export default model<Talent>("talents", talentSchema);
