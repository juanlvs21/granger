import axios from "axios";

export default class API {
  constructor() {
    this.BASE_URL =
      `${process.env.URL_SERVER}/api` || "http://localhost:4000/api";
  }

  // Auth
  async login(email, password) {
    return await axios.post(`${this.BASE_URL}/auth/signin`, {
      email,
      password
    });
  }

  async signup({ firstName, lastName, email, password }) {
    return await axios.post(`${this.BASE_URL}/auth/signup`, {
      firstName,
      lastName,
      email,
      password
    });
  }

  //   Books
  async getAllBooks() {
    return await axios.get(`${this.BASE_URL}/books/all`);
  }

  async uploadBook(formData, token) {
    return await axios.post(`${this.BASE_URL}/books/upload`, formData, {
      headers: {
        authorization: token
      }
    });
  }
}
