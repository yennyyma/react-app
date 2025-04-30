import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
    .connect(MONGO_CONNECTION_STRING + "users")
    .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

app.get("/users", (req, res) => {
    const name = req.query["name"];
    const job = req.query["job"];

    if (name && job) {
        userService
        .findUserByNameAndJob(name, job)
        .then((users) => {
            res.send({ users_list: users });
        })
        .catch((error) => {
            console.log("Error retrieving users:", error);
            res.status(500).json({ error: "Could not retrieve users" }); // Send JSON response
        });
    } else if (name) {
        userService
        .getUsers(name, undefined)
        .then((users) => {
            res.send({ users_list: users });
        })
        .catch((error) => {
            console.log("Error retrieving users:", error);
            res.status(500).json({ error: "Could not retrieve users" }); // Send JSON response
        });
    } else if (job) {
        userService
        .getUsers(undefined, job)
        .then((users) => {
            res.send({ users_list: users });
        })
        .catch((error) => {
            console.log("Error retrieving users:", error);
            res.status(500).json({ error: "Could not retrieve users" }); // Send JSON response
        });
    } else {
        userService
        .getUsers()
        .then((users) => {
            res.send({ users_list: users });
        })
        .catch((error) => {
            console.log("Error retrieving users:", error);
            res.status(500).json({ error: "Could not retrieve users" }); // Send JSON response
        });
    }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
    }

    userService
        .findUserById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).send("Could not find user");
            }
            res.status(200).send(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Could not retrieve user");
        });
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;

    if (!userToAdd.name || !userToAdd.job) {
        return res.status(400).json({ error: "Provide name and job" });
    }

    userService
        .addUser(userToAdd)
        .then((newUser) => {
            const userWithId = { id: newUser._id, name: newUser.name, job: newUser.job };
            res.status(201).send(userWithId);
            console.log("New user added: ", userWithId);

        })
        .catch((error) => {
            console.log("Error adding user:", error);
            res.status(500).json({ error: "Could not add user" });
        });
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
    }

    userService
        .removeUser(id)
        .then((user) => {
            if (!user) {
                return res.status(404).send("Could not find user");
            }

            res.status(204).send();
            console.log("Received ID for deletion:", id);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Could not delete user");
        });
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});