import axios from "axios";

export default class API {
  constructor() {
    this.BASE_URL = "http://167.71.166.176:4000/api";
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
    console.log("Env server:", process.env.URL_SERVER);
    return await axios.post(`${this.BASE_URL}/auth/token`, {
      token
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
