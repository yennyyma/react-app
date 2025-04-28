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
    .catch((errro) => console.log(error));

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

    userService
        .getUsers(name, job)
        .then((users) => {
            res.send({ users_list: users });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Could not retrieve users");
        });
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;

    if (!userToAdd.name || !userToAdd.job) {
        res.status(400).send("Provide name and job");
    }

    userService
        .addUser(userToAdd)
        .then((newUser) => {
            res.status(201).send(newUser);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Could not add user");
        })
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    
    userService
        .findUserById(id)
        .then((user) => {
            if (!user) {
                res.status(404).send("Could not find user");
            }

            return userService.removeUser(id).then(() => {
                res.status(204).send();
            });
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