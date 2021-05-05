import express, { Application, Response, Request, NextFunction } from "express";
import fs from "fs";

interface User {
  id?: number;
  organization: string;
  products: string[];
  marketValue: string;
  address: string;
  ceo: string;
  country: string;
  noOfEmployees: number;
  employees: string[];
  createdAt?: string;
  updatedAt?: string;
}

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3007;
const template: User[] = [{
  id: 1,
  organization: "mafia",
  products: ["developers", "pizza"],
  marketValue: "90%",
  address: "sangotedo",
  ceo: "cn",
  country: "Taiwan",
  noOfEmployees: 2,
  employees: ["james bond", "jackie chan"],
  createdAt: "2021-05-01T04:32:45.513Z",
}]
// this function gets the data from the database and creates a new database if there's no existing database
function getDatabase() {
    try {
        const check = fs.readFileSync(`${__dirname}/database/data.json`);
        return JSON.parse(check.toString());
    } catch (error) {
        return fs.writeFileSync(
          "./database/data.json",
          JSON.stringify(template, null, 2)
        );
    }
}

function writeToDatabase(input: User[]) {
  fs.writeFileSync(
    "./database/data.json",
    JSON.stringify(input, null, 2)
  );
}
let profiles = getDatabase();

// this function gets all the profiles in the database
app.get("/api/profiles", (req: Request, res: Response) => res.json(profiles));

// this function returns a single profile from the database
app.get("/api/profiles/:id", (req: Request, res: Response) => {
  const found = profiles.some((profile: User) => profile.id === +req.params.id);

  if (found) {
    res.json(profiles.filter((profile: User) => profile.id === +req.params.id));
  } else {
    res.status(404).json("user not found");
  }
});

app.post("/api/profiles", (req: Request, res: Response) => {
   
      const lastId = profiles[profiles.length - 1].id;
      const newProfile: User = {
        id: lastId + 1,
        organization: req.body.organization,
        products: req.body.products,
        marketValue: req.body.marketValue,
        address: req.body.address,
        ceo: req.body.ceo,
        country: req.body.country,
        noOfEmployees: req.body.noOfEmployees,
        employees: req.body.employees,
        createdAt: new Date(Date.now()).toISOString(),
      };

      if (!newProfile.organization || !newProfile.products) {
        return res
          .status(400)
          .json({ message: "please enter a valid organization or products" });
      }
      profiles.push(newProfile);
      res.status(201).json(profiles);
      writeToDatabase(profiles);

    
        
});

// update members
app.put("/api/profiles/:id", (req: Request, res: Response) => {
  const found = profiles.some((profile: User) => profile.id === +req.params.id);

  if (found) {
    const updProfile = req.body;

    let index = profiles.findIndex((item: User) => item.id === +req.params.id);
    let updatedAt = new Date(Date.now()).toISOString();
    profiles[index] = {
      updatedAt: updatedAt,
      ...profiles[index],
      ...updProfile,
    };
    let profile = profiles[index];
    writeToDatabase(profiles);
   res.status(200).json(profile);
  } else {
    res
      .status(400)
      .json({ message: `Bad request, profile ${req.params.id} not found` });
  }
});

//  this function deletes a profile fron the database
app.delete("/api/profiles/:id", (req: Request, res: Response) => {
  const found = profiles.some((profile: User) => profile.id === +req.params.id);

  if (found) {
    profiles = profiles.filter(
      (profile: User) => profile.id !== +req.params.id
    );
    res.json("user deleted");
    writeToDatabase(profiles);
  } else {
    res
      .status(404)
      .json(`user not found` );
  }
});

const server = app.listen(port, () => console.log(`server don dey work on port ${port}`));
module.exports = server;
