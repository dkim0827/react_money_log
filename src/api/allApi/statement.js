import { baseUrl } from "../../config";

const Statement = {
  // Fetch all questions from server
  all() {
    return fetch(`${baseUrl}/statements`, {
      credentials: "include"
    }).then(res => res.json());
  },
  // Fetch a single quesion
  one(id) {
    return fetch(`${baseUrl}/statements/${id}`, {
      credentials: "include"
    }).then(res => res.json());
  },
  // Create a Question
  create(params) {
    // params is an object that reperesents a question
    // {body: 'qBody', title: 'qTitle' }
    return fetch(`${baseUrl}/statements`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },
  // Edit a Question
  update(id, params) {
    return fetch(`${baseUrl}/statements/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },
  // Delete a Question
  destroy(id) {
    return fetch(`${baseUrl}/statements/${id}`, {
      credentials: "include",
      method: "DELETE"
    }).then(res => res.json());
  }
};

export default Statement;
