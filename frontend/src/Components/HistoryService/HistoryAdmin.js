import React, { useEffect, useState } from "react";
import { getHistory } from "../../Api/HistoryApi";
import toast from "react-hot-toast";
import { Loader } from "rsuite";
import Badge from "react-bootstrap/Badge";
import ReactPaginate from "react-paginate";

const HistoryTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [historyState, setHistoryState] = useState();
  const [viewChanged, setViewChanged] = useState(false);
  const [ByDoc, setByDoc] = useState(null);
  const [docs, setDocs] = useState(null);
  const userRole = localStorage.getItem("userRole");
  console.log(userRole);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

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
      setIsLoading(false);

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
  }

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

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleHistory = historyState?.filter((history) => history.doc_id === ByDoc.doc_id).slice(startIndex, endIndex);

  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
  const search = () => {
    if (visibleHistory) {
      const results = visibleHistory.filter((history) =>
        Object.values(history).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setSearchResults(results);
    }
  };

  search();
}, [searchQuery, visibleHistory]);

  return (
    <>
      {isLoading ? (
        <Loader size="md" content="Loading.." />
      ) : (
        <>
          <div class="pagetitle">
            <nav>
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="">Acceuil</a></li>
                <li class="breadcrumb-item active">Historique</li>
              </ol>
            </nav>
            <h1 className="text-center">Historique des documents </h1>
          </div>

          <nav class="d-flex justify-content-end">
            <ReactPaginate
              previousLabel={
                <li className="page-item">
                  <a className="page-link" href="#">
                    <i className="bi bi-arrow-left"></i> 
                  </a>
                </li>
              }
              nextLabel={
                <li className="page-item">
                  <a className="page-link" href="#">
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </li>
              }
              breakLabel={<li className="page-item disabled"><span className="page-link">...</span></li>}
              pageCount={Math.ceil(visibleHistory?.length / ITEMS_PER_PAGE)}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active"}
              pageLinkClassName={"page-link"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
              disabledClassName={"disabled"}
              breakClassName={"page-item"}
              pageClassName={"page-item"}
              previousClassName={"page-item"}
              nextClassName={"page-item"}
            />
            
          </nav>

          <div className="d-flex flex-row mb-2">
            {docs &&
              docs.map((d, key) =>
                d.doc_id === ByDoc.doc_id ? (
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
          <div className="row row-cols-1 my-4 text-center">
  <input
    type="text"
    name="search"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Rechercher..."
    className="form-control"
    style={{ maxWidth: "300px", margin: "0 auto" }}
  />
</div>


          <div class="table-responsive">
            <table className="table table-striped">
              <thead className="thead">
                <tr>
                  <th>utilisateur</th>
                  <th>Titre du document</th>
                  <th> Project</th>
                  <th>Description</th>
                  <th>Date</th>
                  {viewChanged ? (
                    <th>
                      <button onClick={removeView} className="btn-close">
                        X
                      </button>
                    </th>
                  ) : (
                    <th></th>
                  )}
                </tr>
              </thead>
              <tbody className="tbody">
              {searchResults.length > 0 ? (
              searchResults.map((history) => (
                    <tr key={history.id}>
                      <td style={{ textAlign: "center" }}>
                        {history.user_firstname} {history.user_lastname}
                      </td>
                      <td>{history.doctitle}</td>
                      <td>{history.project_data.Title}</td>
                      <td>{addBr(history.description)}</td>
                      <td>{history.creation_date.toString()}</td>
                      <td style={{ textAlign: "center", cursor: "pointer" }}>
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
  );
};

export default HistoryTable;
