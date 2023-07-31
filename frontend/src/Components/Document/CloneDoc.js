import { useEffect, useState } from "react";
import axios from "axios";
import "../Generator/model.css";
import { CodeBlock, a11yDark } from "react-code-blocks";
import { addDoc } from "../../Api/DocApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CloneDoc({
  sourceModel,
  notifParentToHide,
  multipleProject,
}) {
  console.log(sourceModel);
  const [page, changePage] = useState(1);
  const [elements, setElements] = useState(null);
  const apibase_element = "http://127.0.0.1:8000/api/elements";
  const [projectListe, setProjectListe] = useState(null);
  const [isError, setiSError] = useState(false);
  const [ErroMessage, setErrorMessage] = useState("");
  const isMultiple = multipleProject != null ? multipleProject : true;
  const navigate = useNavigate();

  const [newDoc, setDoc] = useState({
    titre: sourceModel.titre,
    type: sourceModel.type,
    clonedId: sourceModel.id,
    project_id: -1,
  });
  async function save() {
    if (newDoc.project_id == -1) {
      setiSError(true);
      setErrorMessage("project est requis ! ");
    } else if (newDoc.titre === "") {
      setiSError(true);
      setErrorMessage("titre est requis ! ");
    } else if (newDoc.type === "") {
      setiSError(true);
      setErrorMessage("type est requis ! ");
    } else {
      setErrorMessage("");
      setiSError(false);
      console.log(newDoc);
      toast
        .promise(addDoc(newDoc), {
          loading: "Création en cours...",
          success: <b>Le document a été créé !</b>,
          error: <b>Impossible de créer le document.</b>,
        })
        .then(async (reponse) => {
          let idDoc = reponse.data.id;
          for (let i = 0; i < elements.length; i++) {
            await axios.post(
              `${apibase_element}/doc/${idDoc}`,
              {
                sequence: elements[i].sequence,
                typeofvalue: elements[i].typeofvalue,
                type: elements[i].type,
                value: elements[i].value.data,
              },
              config
            );
          }
          navigate("/ConfigurerDoc", { state: { id: idDoc } });
        });
    }
  }
  function filterProjectsByDocsIDs(projects, docsID) {
    const resultat = projects.filter((project) => {
      const projectDocs = Array.isArray(project.docs)
        ? project.docs
        : [project.docs];
      const projectDocsIDs = projectDocs.map((doc) => doc.id);
      return !projectDocsIDs.includes(docsID);
    });
    return resultat;
  }
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  function fetchData() {
    axios
      .get(`${apibase_element}/doc/${sourceModel.id}`, config)
      .then((res) => {
        setElements(res.data);
      })
      .catch((err) => console.log("err elements ", err));
    axios
      .get(`http://127.0.0.1:8000/api/project/allforuser`, config)
      .then((res2) => {
        if (res2.data.length == 0) {
          setiSError(true);
          setErrorMessage("le projet n'est pas disponible");
        } else {
          setiSError(false);
          setErrorMessage("");
          if (isMultiple) {
            setProjectListe(res2.data);
          } else {
            console.log("I'm here");
            let projectWithFilter = res2.data;
            console.log(sourceModel.id);
            projectWithFilter = filterProjectsByDocsIDs(
              projectWithFilter,
              sourceModel.id
            );
            console.log(projectWithFilter);
            setProjectListe(projectWithFilter);
          }
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="row d-flex justify-content-end col-10 mx-auto">
        {page > 1 && (
          <button
            className="btn btn-secondary col-2 me-1"
            onClick={() => changePage(page - 1)}
          >
            back
          </button>
        )}
        {page == 1 && (
          <button
            className="btn btn-secondary col-2 me-1"
            onClick={() => notifParentToHide()}
          >
            back
          </button>
        )}
        {page < 2 && (
          <button
            className="btn btn-primary col-2"
            onClick={() => changePage(page + 1)}
          >
            next
          </button>
        )}
      </div>
      {page == 1 && (
        <div className="element-preview ">
          {elements &&
            elements
              .sort((a, b) => a.sequence - b.sequence)
              .map((element, key) => (
                <>
                  {element.typeofvalue == "__html" && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: element.value.data,
                      }}
                    />
                  )}
                  {element.type == "Code" && (
                    <CodeBlock
                      text={element.value.data}
                      language={element.typeofvalue}
                      showLineNumbers={true}
                      theme={a11yDark}
                      startingLineNumber={1}
                      codeBlock={{ lineNumbers: true, wrapLines: false }}
                    />
                  )}
                  {element.type == "Image" && (
                    <>
                      <img src={element.value.data} /> <br />
                    </>
                  )}
                </>
              ))}
        </div>
      )}
      {page == 2 && (
        <>
          <div class="card mx-auto w-50">
            <div class="card-body">
              <h5 className="card-title text-center">Nouveau Document</h5>

              <div class="col-12">
                <div class="d-flex justify-content-between">
                  {" "}
                  <label for="yourName" class="form-label">
                    {" "}
                    Titre
                  </label>
                </div>
                <div class="input-group has-validation">
                  <span class="input-group-text" id="inputGroupPrepend">
                    <i class="bi bi-card-heading  text-primary "> </i>
                  </span>
                  <input
                    type="text"
                    name="titre"
                    class="form-control"
                    value={newDoc.titre}
                    onChange={(e) =>
                      setDoc({ ...newDoc, [e.target.name]: e.target.value })
                    }
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="d-flex justify-content-between">
                  <label for="documentType" class="form-label">
                    Type de document
                  </label>
                </div>
                <div class="input-group has-validation">
                  <span class="input-group-text" id="inputGroupPrepend">
                    <i class="bi bi-file-earmark-zip text-primary"> </i>
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    disabled={true}
                    value={newDoc.type}
                  />
                </div>
              </div>
              {projectListe != null ? (
                <div class="col-12">
                  <div class="d-flex justify-content-between">
                    {" "}
                    <label for="yourEmail" class="form-label">
                      {" "}
                      Projet
                    </label>
                  </div>
                  <div class="input-group has-validation">
                    <span class="input-group-text" id="inputGroupPrepend">
                      <i class="bi bi-stack text-primary "> </i>
                    </span>
                    <select
                      class="form-select"
                      name="project_id"
                      onChange={(e) =>
                        setDoc({
                          ...newDoc,
                          [e.target.name]: Number(e.target.value),
                        })
                      }
                    >
                      <option value={-1}>Selectionnez un projet</option>
                      {projectListe.map((p, ke) => (
                        <option value={p.id}>{p.Title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                isError && (
                  <div className="alert alert-light my-3">{ErroMessage}</div>
                )
              )}

              <div class="text-center">
                <br></br>
                {isError && projectListe && (
                  <div className="alert alert-light my-3">{ErroMessage}</div>
                )}
                <button
                  type="submit"
                  class="btn btn-primary"
                  variant="primary"
                  onClick={save}
                >
                  Sauvgarder
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
