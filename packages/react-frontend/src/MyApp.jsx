// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  
  function removeOneCharacter(index) {
    const userToDelete = characters[index];
    fetch (`http://localhost:8000/users/${userToDelete._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          const updated = characters.filter((character, i) => i !== index);
          setCharacters(updated);
          console.log("Deleting user with ID:", userToDelete._id);
        }
        else if (res.status === 404) {
          console.log("User not found");
        }
        else {
          throw new Error(`Failed to delete user`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((newUser) => {
        setCharacters([...characters, newUser]);
        console.log("Updated characters:", characters);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((json) => {
        setCharacters(json["users_list"]);
      });
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    }).then((res) => {
      if (res.status === 201) {
        return res.json();
      } else {
        throw new Error(`Failed to create new user`);
      }
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table
        characterData={characters} 
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList}/>
    </div>
  );
}

export default MyApp;
