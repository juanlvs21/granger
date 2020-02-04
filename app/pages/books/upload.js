import React, { useState } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import { connect } from "react-redux";

// Font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

// Actions
import { showMenuMobileAction } from "../../store/actions/appActions";

// Components
import Loading from "../../components/core/Loading";
import Notification from "../../components/core/Notification";

const UploadBook = ({ state }) => {
  const [pdf, setPdf] = useState(null);
  const [cover, setCover] = useState(null);
  const [book, setBook] = useState({
    title: "",
    authors: "",
    editorial: "",
    yearPublication: "",
    genre: [],
    price: 0,
    quantity: 0,
    uploadedBy: {
      uuid: state.user.uuid,
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      email: state.user.email
    }
  });

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChangeFile = e => {
    if (e.target.name === "cover") {
      if (e.target.files[0]) {
        setCover(e.target.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
          setPreview(reader.result);
        };
      } else {
        setCover(null);
        setPreview(null);
      }
    } else if (e.target.name === "pdf") {
      setPdf(e.target.files[0]);
    }
  };

  const onChange = e => {
    if (e.target.name === "price" || e.target.name === "quantity") {
      setBook({
        ...book,
        [e.target.name]: e.target.value > 0 ? e.target.value : 1
      });
    } else if (e.target.name === "yearPublication") {
      const year = new Date().getFullYear();
      if (e.target.value <= 0) {
        setBook({
          ...book,
          [e.target.name]: 1
        });
      } else if (e.target.value >= year) {
        setBook({
          ...book,
          [e.target.name]: year
        });
      } else {
        setBook({
          ...book,
          [e.target.name]: e.target.value
        });
      }
    } else {
      console.log(e.target);
      setBook({
        ...book,
        [e.target.name]: e.target.value
      });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("cover", cover);
    formData.append("pdf", pdf);
    formData.append("book", JSON.stringify(book));

    await axios
      .post("http://localhost:4000/api/books/upload/cover", formData, {
        headers: {
          authorization: state.user.token
        }
      })
      .then(({ data }) => {
        Router.push(`/books/${data.data}`);
      })
      .catch(err => {
        if (
          err.response.data.code === "auth/authentication-required" ||
          err.response.data.code === "books/cover-pdf-is-required" ||
          err.response.data.code === "books/cover-is-required" ||
          err.response.data.code === "books/cover-must-be-jpg-jpeg-png" ||
          err.response.data.code === "books/book-must-be-pdf" ||
          err.response.data.code === "books/pdf-is-required" ||
          err.response.data.code === "books/name-is-empty" ||
          err.response.data.code === "books/price-quantity-greater-than-zero" ||
          err.response.data.code ===
            "books/price-quantity-year-must-be-numbers" ||
          err.response.data.code === "books/year-publication-less-current-year"
        ) {
          setError(err.response.data.message.es);
          setTimeout(() => setError(null), 5000);
        } else {
          setError("Error desconocido");
          setTimeout(() => setError(null), 5000);
        }
      })
      .finally(() => setLoading(false));
  };

  const closeNotification = () => {
    setError(null);
  };

  return (
    <>
      <Head>
        <title>Nuevo Libro | Granger </title>
      </Head>
      <div className="container">
        <h1 className="is-size-2 has-text-centered has-text-weight-semibold">
          Nuevo libro
        </h1>
        <form>
          <div className="columns">
            <div className="column has-text-right">
              <button className="button is-info is-rounded" onClick={onSubmit}>
                Subir
              </button>
            </div>
          </div>

          {loading && <Loading />}
          {error && (
            <Notification
              type="is-danger"
              message={error}
              close={closeNotification}
            />
          )}

          <div className="columns is-multiline">
            <div className="column">
              <div className="field">
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="text"
                    placeholder="Titulo"
                    name="title"
                    value={book.title}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="text"
                    placeholder="Autor/Autores"
                    name="authors"
                    value={book.authors}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="text"
                    placeholder="Editorial"
                    name="editorial"
                    value={book.editorial}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="number"
                    placeholder="Precio"
                    name="price"
                    value={book.price}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="number"
                    placeholder="Cantidad"
                    name="quantity"
                    value={book.quantity}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="number"
                    placeholder="Año de publicación"
                    name="yearPublication"
                    value={book.yearPublication}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="columns is-multiline">
            <div className="column">
              <div className="field granger__field-file">
                <div className="file has-name">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      onChange={onChangeFile}
                      name="pdf"
                      required
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <FontAwesomeIcon icon={faUpload} />
                      </span>
                      <span className="file-label">Libro (PDF)</span>
                    </span>
                    <span className="file-name">
                      {pdf ? pdf.name : "Seleccione su libro"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field granger__field-file">
                <div className="file has-name">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      onChange={onChangeFile}
                      name="cover"
                      required
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <FontAwesomeIcon icon={faUpload} />
                      </span>
                      <span className="file-label">Portada</span>
                    </span>
                    <span className="file-name">
                      {cover ? cover.name : "Selecione su portada"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {preview && (
            <div className="granger__preview">
              <div className="granger__preview-img"></div>
            </div>
          )}
        </form>
      </div>
      <style jsx>{`
        .container,
        form {
          margin-top: 30px;
        }

        .column {
          padding: 10px 20px;
        }

        .granger__field-file {
          display: flex;
          justify-content: center;
        }

        .file.has-name .file-cta {
          width: 150px;
        }

        .file.has-name .file-name {
          width: 200px;
        }

        .granger__preview {
          display: flex;
          justify-content: center;
        }
        .granger__preview .granger__preview-img {
          width: 300px;
          height: 300px;
          background: url(${preview});
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 10px;
        }

        @media (max-width: 425px) {
          .file.has-name .file-cta {
            width: 130px;
          }
          .file.has-name .file-name {
            width: 120px;
          }
          .granger__preview .granger__preview-img {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </>
  );
};

UploadBook.getInitialProps = async ({ store }) => {
  store.dispatch(showMenuMobileAction(false));
  return {};
};

const mapStateToProps = reducers => {
  return {
    state: {
      user: reducers.session.user
    }
  };
};

export default connect(mapStateToProps)(UploadBook);
