import React, { useState, useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import axios from "axios";
import { connect } from "react-redux";
import { MdFileUpload } from "react-icons/md";

// Actions
import { showMenuMobileAction } from "../../store/actions/appActions";
import { addGenresSelectedAction } from "../../store/actions/bookActions";

// Components
import Loading from "../../components/core/Loading";
import Notification from "../../components/core/Notification";
import GenresModal from "../../components/book/GenresModal";

// Utils
import redirect from "../../utils/redirect";
import API from "../../utils/API";
const service = new API();

const UploadBook = ({ state, actions }) => {
  const [pdf, setPdf] = useState(null);
  const [cover, setCover] = useState(null);
  const [showModalGenres, setShowModalGenres] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [book, setBook] = useState({
    title: "",
    authors: "",
    editorial: "",
    description: "",
    yearPublication: "",
    genre: [],
    price: 0,
    uploadedBy: {
      uuid: state.user ? state.user.uuid : null,
      firstName: state.user ? state.user.firstName : null,
      lastName: state.user ? state.user.lastName : null,
      email: state.user ? state.user.email : null
    }
  });

  useEffect(() => {
    actions.clearGenres();
  }, []);

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
      setBook({
        ...book,
        [e.target.name]: e.target.value
      });
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);

    const bookForSend = {
      ...book,
      genre: state.genresSelected
    };

    const formData = new FormData();
    formData.append("cover", cover);
    formData.append("pdf", pdf);
    formData.append("book", JSON.stringify(bookForSend));

    service
      .uploadBook(formData, state.user.token)
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
          err.response.data.code === "books/price-greater-than-zero" ||
          err.response.data.code === "books/price-year-must-be-numbers" ||
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

  const handleCloseModalGenres = () => {
    setShowModalGenres(false);
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
                <label htmlFor="title" className="label">
                  Titulo
                </label>
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="text"
                    placeholder="Titulo"
                    name="title"
                    id="title"
                    value={book.title}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="authors" className="label">
                  Autor/Autores
                </label>
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="text"
                    placeholder="Autor/Autores"
                    name="authors"
                    id="authors"
                    value={book.authors}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label htmlFor="price" className="label">
                  Precio ($)
                </label>
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="number"
                    placeholder="Precio"
                    name="price"
                    id="price"
                    value={book.price}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="yearPublication" className="label">
                  Año de publicación
                </label>
                <div className="control">
                  <input
                    className="input is-info is-rounded"
                    type="number"
                    placeholder="Año de publicación"
                    name="yearPublication"
                    id="yearPublication"
                    value={book.yearPublication}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <div className="field">
                <label htmlFor="description" className="label">
                  Titulo
                </label>
                <div className="control">
                  <textarea
                    className="textarea is-info is-rounded"
                    placeholder="Descripción"
                    name="description"
                    id="description"
                    value={book.description}
                    onChange={onChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="columns is-multiline">
            <div className="column">
              <div className="control granger__genre-container">
                <button
                  className="button is-primary is-small is-rounded"
                  type="button"
                  onClick={() => setShowModalGenres(true)}
                >
                  <b>Agregar Género</b>
                </button>

                <div className="granger__genre-tag">
                  {state.genresSelected && (
                    <>
                      {state.genresSelected.map((genreSelected, i) => (
                        <span className="tag is-primary" key={i}>
                          {genreSelected}
                        </span>
                      ))}
                    </>
                  )}
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
                        <MdFileUpload />
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
                        <MdFileUpload />
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

      <GenresModal
        show={showModalGenres}
        handleClose={handleCloseModalGenres}
        token={state.user ? state.user.token : null}
      />

      <style jsx>{`
        .container,
        form {
          margin-top: 30px;
        }

        .column {
          padding: 10px 20px;
        }

        .granger__genre-container {
          display: flex;
          align-items: center;
        }

        .granger__genre-container .granger__genre-tag {
          margin-left: 10px;
        }

        .granger__genre-container .granger__genre-tag span {
          margin: 5px;
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

UploadBook.getInitialProps = async ({ store, res }) => {
  store.dispatch(showMenuMobileAction(false));
  const { session } = store.getState();

  if (session.user) {
    if (!session.user.admin) {
      redirect(res, "/");
    }
  } else {
    redirect(res, "/");
  }

  return {};
};

const mapStateToProps = reducers => {
  return {
    state: {
      user: reducers.session.user,
      genresSelected: reducers.book.genresSelected
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      clearGenres: () => dispatch(addGenresSelectedAction([]))
    }
  };
};

UploadBook.getInitialProps = async ({ store }) => {
  store.dispatch(showMenuMobileAction(false));
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadBook);
