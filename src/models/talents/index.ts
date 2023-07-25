import { Schema, model } from "mongoose";

export interface Talent {
  _id?: string;
  authId?: string;
  firstName: string;
  lastName: string;
  email: string;
  languages?: Skill[];
  frameworks?: Skill[];
  databases?: Skill[];
  otherSkills?: Skill[];
  jobHistory?: JobExperience[];
  educationHistory?: Education[];
  isAdmin?: boolean;
  social: {
    personalWebsite?: string;
    linkedin: string;
    instagram?: string;
    git?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JobExperience {
  companyName: string;
  roleName: string;
  employmentType: EmploymentType;
  location: string;
  locationType: LocationType;
  currentEmployment: boolean;
  startDate: Date;
  endDate?: Date;
  description: string;
  skills: Skill[];
}

export interface Education {
  institution: string;
  course: string;
  start: Date;
  end?: Date;
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

export interface Skill {
  label: string;
  value: string;
}

export interface GetTalentQuery {
  id?: string;
  email?: string;
  authId?: string;
}

export interface TalentSearchQuery {
  pageNumber?: number;
  pageSize?: number;
  freeText?: string;
  name?: string;
  email?: string;
  languages?: string;
  frameworks?: string;
  databases?: string;
  otherSkills?: string;
}

const educationSchema = new Schema<Education>(
  {
    institution: { type: String, required: true },
    course: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date },
  },
  { timestamps: true }
);

export const skillSchema = new Schema<Skill>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

const jobExperienceSchema = new Schema<JobExperience>(
  {
    companyName: { type: String, required: true },
    roleName: { type: String, required: true },
    employmentType: { type: Number, required: true },
    location: { type: String, required: true },
    locationType: { type: Number, required: true },
    currentEmployment: { type: Boolean, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String, required: true },
    skills: { type: [skillSchema], default: [] },
  },
  { timestamps: true }
);

const talentSchema = new Schema<Talent>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authId: { type: String, required: true, unique: true },
    languages: { type: [skillSchema], default: [] },
    frameworks: { type: [skillSchema], default: [] },
    databases: { type: [skillSchema], default: [] },
    otherSkills: { type: [skillSchema], default: [] },
    jobHistory: { type: [jobExperienceSchema], default: [] },
    educationHistory: { type: [educationSchema], default: [] },
    isAdmin: { type: Boolean, default: false },
    social: {
      type: {
        personalWebsite: { type: String },
        linkedin: { type: String, required: true },
        instagram: { type: String },
        git: { type: String },
      },
    },
  },
  { timestamps: true }
);

talentSchema.index({ email: 1, authId: 1 });

export default model<Talent>("talents", talentSchema);
