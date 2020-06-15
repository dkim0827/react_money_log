import { baseUrl } from "../../config";

const Transaction = {
  // Fetch a single quesion
  one(id) {
    return fetch(`${baseUrl}/statements/:id/transactions/${id}`, {
      credentials: "include"
    }).then(res => res.json());
  },
  // Create a Question
  create(statement_id, params) {
    // params is an object that reperesents a question
    // {body: 'qBody', title: 'qTitle' }
    // console.log(statement_id);
    return fetch(`${baseUrl}/statements/${statement_id}/transactions`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },
  // Edit a Question
  update(statement_id, params) {
    return fetch(
      `${baseUrl}/statements/${statement_id}/transactions/${params.transaction.id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      }
    ).then(res => res.json());
  },

  destroy(statement_id, id) {
    return fetch(`${baseUrl}/statements/${statement_id}/transactions/${id}`, {
      credentials: "include",
      method: "DELETE"
    }).then(res => res.json());
  }
};

export default Transaction;
