import axios from "axios";

export default class API {
  constructor() {
    this.BASE_URL = `${process.env.URL_SERVER}/api`;
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

  async token() {
    return await axios.post(`${this.BASE_URL}/auth/token`, {
      token
    });
  }

  //   Books
  async getAllBooks() {
    console.log("Env:", process.env.URL_SERVER);
    console.log("Base:", this.BASE_URL);
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
