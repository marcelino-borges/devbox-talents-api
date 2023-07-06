import { Types } from "mongoose";
import TalentDB, { Talent, TalentQuery } from "../../models/talents";

export const getTalents = async () => {
  const found = await TalentDB.find();

  if (!found) {
    throw new Error("Could not find talents.");
  }

  return found;
};

export const getTalent = async ({ id, email, authId }: TalentQuery) => {
  const found = await TalentDB.findOne({
    $or: [{ _id: new Types.ObjectId(id) }, { email }, { authId }],
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
