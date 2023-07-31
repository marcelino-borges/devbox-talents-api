export const createRegex = (string: string) => ({
  $regex: string,
  $options: "i",
});

export const getSkillElementMatch = (skillsArray: string[]) => {
  const or: any[] = [];

  skillsArray.forEach((skill: string) => {
    or.push({
      $or: [
        {
          label: {
            $regex: skill,
            $options: "i",
          },
        },
        {
          value: {
            $regex: skill,
            $options: "i",
          },
        },
      ],
    });
  });

  return {
    $elemMatch: {
      $or: or,
    },
  };
};

export const getArrayFromString = (originalString: string) => {
  return originalString.replace(/\s/, "").split(",");
};
