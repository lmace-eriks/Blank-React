export const trace = (string: string) => {
  console.log(
    "%c" + string,
    "display: block; width: 80%; margin: auto; background-color: blue; color: white; font-weight: bold; font-size: 15px; text-align: center; padding: 10px;"
  );
};

export const regex = () => {
  const lookForMe: any = ["Road", "Electric", "Aventon", "Mountain"];

  for (let i = 0; i < lookForMe.length; i++) {
    const topic = new RegExp(lookForMe[i], "i");
    const searchInside = "gimmie a mountain dew!";
    const stringFound = topic.test(searchInside);
    if (stringFound) {
      console.log("Found " + lookForMe[i] + " at position " + i);
    }
  }
};
