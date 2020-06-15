import { baseUrl } from "../../config";

const User = {
  // Get Current User
  current() {
    return fetch(`${baseUrl}/users/current`, {
      method: "GET",
      credentials: "include"
    }).then(res => res.json());
  },

  // Create a User
  create(params) {
    return fetch(`${baseUrl}/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },

  // Edit a User
  update(id, params) {
    return fetch(`${baseUrl}/users/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },

  // Edit a Password
  password_update(id, params) {
    return fetch(`${baseUrl}/users/${id}/password_edit`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },

  // Destroy a User
  destroy(id) {
    return fetch(`${baseUrl}/users/${id}`, {
      credentials: "include",
      method: "DELETE"
    }).then(res => res.json());
  }
};

export default User;
