export interface PrettyTitle {
  ugly: string;
  pretty: string;
}

const sortArray = (x: PrettyTitle, y: PrettyTitle) => {
  if (x.ugly < y.ugly) return -1;
  if (x.ugly > y.ugly) return 1;
  return 0;
};

// This should be a list on the back end --
const unsortedUglyList: Array<PrettyTitle> = [
  {
    ugly: "Electric and Bike",
    pretty: "Electric Bike",
  },
  {
    ugly: "Electric and Cycling",
    pretty: "Electric Bike",
  },
  {
    ugly: "Road and Bike",
    pretty: "Road Cycling",
  },
  {
    ugly: "Cycling and Bike",
    pretty: "Cycling",
  },
  {
    ugly: "Cycling and Bicycle",
    pretty: "Cycling",
  },
  {
    ugly: "Ebike and Bike",
    pretty: "Electric Bike",
  },
  {
    ugly: "Electric and Mountain and Cycling",
    pretty: "Electric Mountain Bike",
  },
  {
    ugly: "Specialized and Rockhopper",
    pretty: "Specialized Rockhopper",
  },
  {
    ugly: "Gravel and Bike",
    pretty: "Gravel Bike",
  },
  {
    ugly: "Road and Electric and Cycling",
    pretty: "Electric Road Bike",
  },
  {
    ugly: "Road and Electric Bike",
    pretty: "Electric Road Bike",
  },
  {
    ugly: "Road and Gravel and Cycling",
    pretty: "Gravel Bike",
  },
  {
    ugly: "Road and Cycling",
    pretty: "Road Cycling",
  },
  {
    ugly: "Urban and Cycling",
    pretty: "Commuting",
  },
  {
    ugly: "Commut",
    pretty: "Commuting",
  },
  {
    ugly: "Road and Urban and Touring and Cycling",
    pretty: "Commuting",
  },
  {
    ugly: "Ski and Snowboard and Winter",
    pretty: "Winter",
  },
  {
    ugly: "Electric and Recreation and Cycling",
    pretty: "Recreational Electric Bike",
  },
  {
    ugly: "Specialized and Stumpjumper",
    pretty: "Specialized Stumpjumper",
  },
];

export const uglyList: Array<PrettyTitle> = unsortedUglyList.sort(sortArray);
