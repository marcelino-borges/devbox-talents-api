import { Schema, model } from "mongoose";

export interface Talent {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  skills?: string[];
  jobHistory?: Job[];
  personalWebsite?: string;
  linkedin: string;
  instagram?: string;
  git?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Job {
  companyName: string;
  roleName: string;
  employmentType: EmploymentType;
  location: string;
  locationType: LocationType;
  currentEmployment: boolean;
  startData: Date;
  endDate: Date;
  description: string;
  skills: string[];
}

export enum EmploymentType {
  FULL_TIME,
  PART_TIME,
  SELF_EMPLOYED,
  FREELANCE,
  CONTRACT,
  INTERNSHIP,
  APPRENTICESHIP,
}

export enum LocationType {
  REMOTE,
  ONSITE,
  HYBRID,
}

export interface TalentQuery {
  id?: string;
  email?: string;
}

const jobSchema = new Schema<Job>(
  {
    companyName: { type: String, required: true },
    roleName: { type: String, required: true },
    employmentType: { type: Number, required: true },
    location: { type: String, required: true },
    locationType: { type: Number, required: true },
    currentEmployment: { type: Boolean, required: true },
    startData: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

const talentSchema = new Schema<Talent>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    skills: { type: [String], default: [] },
    jobHistory: { type: [jobSchema], default: [] },
    personalWebsite: { type: String },
    linkedin: { type: String, required: true },
    instagram: { type: String },
    git: { type: String },
  },
  { timestamps: true }
);

talentSchema.index({ email: 1 });

export default model<Talent>("talents", talentSchema);
