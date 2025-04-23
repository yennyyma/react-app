import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspiring actress"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        }
    ]
};
const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};
const findUserByJob = (job) => {
    return users["users_list"].filter(
        (user) => user["job"] === job
    );
};
const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

app.use(cors());
app.use(express.json());

const addUser = (user) => {
    users["users_list"].push(user);
    return users;
};
const removeUser = (id) => {
    users["users_list"] = users["users_list"].filter(
        (user) => user["id"] !== id
    );
    return users;
};

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    if (name && job) {
        const userByName = findUserByName(name);
        const userByJob = findUserByJob(job);

        const result = userByName.filter(
            (user) => userByJob.includes(user)
        )

        res.send(result);
    } else if (!name && !job) {
        res.send(users);
    } else {
        res.status(400).send("Must provide name and job");
    }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.send();
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        removeUser(id);
        res.status(200).send(`User successfully removed.`);
    }
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});