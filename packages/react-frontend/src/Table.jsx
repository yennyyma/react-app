// src/Table.jsx
import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Job</th>
        <th>Remove</th>
      </tr>
    </thead>
  );
}

function TableBody({characterData, removeCharacter}) {
  return (
    <tbody>
      {characterData.map((row, index) => (
        <tr key={index}>
          <td>{row.id}</td>
          <td>{row.name}</td>
          <td>{row.job}</td>
          <td>
            <button onClick={() => removeCharacter(index)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function Table(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        characterData={props.characterData}
        removeCharacter={props.removeCharacter}
      />
    </table>
  );
}
export default Table;
