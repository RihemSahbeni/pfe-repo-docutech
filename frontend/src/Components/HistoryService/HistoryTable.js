import React, { useEffect, useState } from "react";
import { getHistory } from "../../Api/HistoryApi";
import toast from "react-hot-toast";
import { Loader } from "rsuite";
import Badge from "react-bootstrap/Badge";
import HistoryAdmin from "./HistoryAdmin";
import HistoryUser from "./HistoryUser";

const HistoryTable = () => {
  const [isLoading, setisLoading] = useState(true);
  const [historyState, setHistoryState] = useState();
  const [viewChanged, setViewChanged] = useState(false);
  const [ByDoc, setByDoc] = useState(null);
  const [docs, setDocs] = useState(null);
  const userRole = localStorage.getItem("userRole");
  console.log(userRole);

  // Get data and set it in the store of history
  const getData = async () => {
    try {
      const data = await getHistory();
      let ArrayOfDocs = [];
      data.forEach((element) => {
        if (!ArrayOfDocs.map((a) => a.doc_id).includes(element.doc_id))
          ArrayOfDocs.push({
            doc_id: element.doc_id,
            doctitle: element.doctitle,
          });
      });
      setDocs(ArrayOfDocs);
      setByDoc(ArrayOfDocs[0]);
      setHistoryState(data);
      setisLoading(false);

      console.log("history data:", data);
    } catch (error) {
      console.error(error);
      toast.error("Échec lors de la récupération des données d'historique.");
    }
  };

  function removeView() {
    setViewChanged(false);
    getData();
  }

  useEffect(() => {
    getData();
    if (!isLoading) {
      console.log(historyState);
    }
  }, []);
  const addBr = (description) => {
    const chunks = description.match(/.{1,34}/g);
    return chunks.map((chunk, index) => (
      <React.Fragment key={index}>
        {chunk}
        <br />
      </React.Fragment>
    ));
  };
  function getBg(slug) {
    if (slug.toString().toUpperCase() === "AJOUT") {
      return "success";
    } else if (slug.toString().toUpperCase() === "SUPPRESSION") {
      return "danger";
    } else if (slug.toString().toUpperCase() === "MODIFICATION") {
      return "warning";
    }
  }
  function changeView(doc) {
    setByDoc(doc);
  }
  /*
  return (
    <>
      {isLoading ? (
        <Loader size="md" content="Loading.." />
      ) : (
        <>
          <div className="d-flex flex-row mb-2">
            {docs &&
              docs.map((d, key) =>
                d.doc_id == ByDoc.doc_id ? (
                  <h6 className="mr-auto p-2" key={key}>
                    <Badge pill bg="primary" style={{ cursor: "pointer" }}>
                      {d.doctitle}
                    </Badge>
                  </h6>
                ) : (
                  <h6 className="mr-auto p-2" key={key}>
                    <Badge
                      pill
                      bg="secondary"
                      style={{ cursor: "pointer" }}
                      onClick={() => changeView(d)}
                    >
                      {d.doctitle}
                    </Badge>
                  </h6>
                )
              )}
          </div>
          <div class="table-responsive">
            <table className="table table-striped">
              <thead className="thead">
                <tr>
                  <th>utilisateur</th>
                  <th>Titre du document</th>
                  <th>Description</th>
                  <th>Date</th>
                  {viewChanged ? (
                    <th>
                      {" "}
                      <button onClick={removeView} className="btn-close">
                        X
                      </button>{" "}
                    </th>
                  ) : (
                    <th></th>
                  )}
                </tr>
              </thead>
              <tbody className="tbody">
                {historyState && historyState.length > 0 ? (
                  historyState
                    .filter((history) => history.doc_id === ByDoc.doc_id)
                    .map((history) => (
                      <tr key={history.id}>
                        <td style={{ "text-align": "center" }}>
                          {history.user_firstname} {history.user_lastname}
                        </td>
                        <td>{history.doctitle}</td>
                        <td>{addBr(history.description)}</td>
                        <td>{history.creation_date.toString()}</td>
                        <td
                          style={{ "text-align": "center", cursor: "pointer" }}
                        >
                          <h6>
                            <Badge pill bg={getBg(history.slug)}>
                              {history.slug}
                            </Badge>
                          </h6>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No history data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );*/
  if (userRole === "Utilisateur") {
    return <HistoryUser />;
  } else {
   // return <></>;
   return <HistoryAdmin />;
  }
};

export default HistoryTable;
