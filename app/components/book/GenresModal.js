import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

// Components
import Loading from "../core/Loading";
import Notification from "../core/Notification";

// Actions
import { addGenresSelectedAction } from "../../store/actions/bookActions";

// Utils
import API from "../../utils/API";
const service = new API();

const GenresModal = ({ show, handleClose, token, state, actions }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState("");
  const [allGenres, setAllGenres] = useState(["uno", "dos"]);

  useEffect(() => {
    getAllGenres();
  }, []);

  const handleAddGenresSelected = selected => {
    const newGenresSelecte = state.genresSelected;
    newGenresSelecte.push(selected);

    actions.addGenresSelected(newGenresSelecte);
  };

  const handleRemoveGenresSelected = selected => {
    const newGenresSelecte = state.genresSelected;
    const i = newGenresSelecte.indexOf(selected);
    newGenresSelecte.splice(i, 1);

    actions.addGenresSelected(newGenresSelecte);
  };

  const getAllGenres = async () => {
    await service
      .getAllGenres()
      .then(({ data }) => {
        setAllGenres(data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleChange = e => {
    setGenre(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    setLoading(true);

    service
      .addGenre(genre, token)
      .then(res => {
        setGenre("");
        getAllGenres();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const closeNotification = () => {
    setError(null);
  };

  return (
    <>
      <div className={`modal ${show ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Géneros</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={handleClose}
            ></button>
          </header>
          <section className="modal-card-body">
            <h2 className="is-size-6">Agregar nuevo Género</h2>
            <div className="columns is-multiline">
              <div className="column">
                <form onSubmit={handleSubmit}>
                  <div className="field has-addons">
                    <div className="control" style={{ width: "100%" }}>
                      <input
                        className="input is-info  is-rounded"
                        type="text"
                        placeholder="Género"
                        value={genre}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="control">
                      <button className="button is-info  is-rounded">
                        Agregar
                      </button>
                    </div>
                  </div>

                  {loading && <Loading />}
                </form>
              </div>
            </div>

            <h2 className="is-size-6">Disponibles</h2>
            <div className="columns is-multiline">
              <div
                className="column granger__genres-container"
                style={{ paddingTop: "15px" }}
              >
                {allGenres.map((genreItem, i) => (
                  <button
                    className="button is-info is-small"
                    key={i}
                    style={{ margin: "5px" }}
                    onClick={() => handleAddGenresSelected(genreItem.genre)}
                  >
                    {genreItem.genre}
                  </button>
                ))}
              </div>
            </div>

            <hr />
            <h2 className="is-size-6">Seleccionados</h2>
            <div className="columns is-multiline">
              <div
                className="column granger__genres-container"
                style={{ paddingTop: "15px" }}
              >
                {state.genresSelected.length > 0 && (
                  <>
                    {state.genresSelected.map((genreSelected, i) => (
                      <button
                        className="button is-primary is-small"
                        key={i}
                        style={{ margin: "5px" }}
                        onClick={() =>
                          handleRemoveGenresSelected(genreSelected)
                        }
                      >
                        {genreSelected}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>
          <footer
            className="modal-card-foot"
            style={{
              justifyContent: "flex-end"
            }}
          >
            <button type="button" className="button" onClick={handleClose}>
              Cancelar
            </button>
          </footer>
        </div>
      </div>

      <style>{`
    .granger__genres-container {
      display:flex;
      justify-content:center;
      flex-wrap: wrap;
    }
    `}</style>
    </>
  );
};

const mapStateToProps = reducers => {
  return {
    state: {
      genresSelected: reducers.book.genresSelected
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      addGenresSelected: genresSelected =>
        dispatch(addGenresSelectedAction(genresSelected))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GenresModal);
