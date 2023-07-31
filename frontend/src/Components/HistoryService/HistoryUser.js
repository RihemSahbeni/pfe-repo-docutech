import { useDispatch } from "react-redux";
import { getMyDoc } from "../../Api/DocApi";
import { setDoc } from "../../store/DocSlice";
import React, { useEffect, useState } from "react";
import { Hypnosis} from "react-cssfx-loading"
import Badge from "react-bootstrap/Badge";
import { getHistoryByDoc } from "../../Api/HistoryApi";
import ReactPaginate from "react-paginate";

export default function HistoryUser() {
  const dispatch = useDispatch();
  const [DocOfUser, setDocOfUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocHistory, setSelectedDocHistory] = useState(null);
  const [histories, setHistories] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  const changeHisotrySelect = (Doc) => {
    setSelectedDocHistory(Doc);
    setCurrentPage(0);
  };
  const fetchHistories = async () => {
    if (selectedDocHistory && selectedDocHistory.id) {
      let historiesData = await getHistoryByDoc(selectedDocHistory.id);
      if (selectedSlug != null) {
        historiesData = historiesData.filter((d) => d.slug === selectedSlug);
      }
      setHistories(historiesData);
    }
  };
  
  const getData = async () => {
    const data = await getMyDoc();
    if (data && data.length > 0) {
      dispatch(setDoc(data));
      setDocOfUser(data);
      setSelectedDocHistory(data[0]);
      const historiesData = await getHistoryByDoc(data[0].id);
      setHistories(historiesData);
      setIsLoading(false);
    }
  };
  

  const addBr = (description) => {
    if (description) {
      const chunks = description.match(/.{1,34}/g);
      return chunks.map((chunk, index) => (
        <React.Fragment key={index}>
          {chunk}
          <br />
        </React.Fragment>
      ));
    }
    return null;
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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedDocHistory != null) {
      fetchHistories();
    }
  }, [selectedDocHistory, selectedSlug]);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleDocs = DocOfUser?.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div >
         <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="">Acceuil</a></li>
                <li className="breadcrumb-item active">Historique</li>
              </ol>
            </nav>
            <div className="text-center mt-5">
      <div className="col-6 mx-auto">
        <Hypnosis color="#a6cee3" width="100px" height="100px" duration="3s" />
      </div>
    </div>
      </div>
    );
  } else {
    return (
      
      <>
        <div>
          <div className="pagetitle">
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="">Acceuil</a></li>
                <li className="breadcrumb-item active">Historique</li>
              </ol>
            </nav>
            <h1 className="text-center">Historique des documents</h1>
            <nav className="d-flex justify-content-end">
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
                pageCount={Math.ceil(DocOfUser?.length / ITEMS_PER_PAGE)}
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
          </div>
        </div>

        <div className="d-flex flex-row flex-wrap mb-2">
          {selectedSlug && (
            <h6 className="mr-auto p-2">
              <Badge
                pill
                bg="danger"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedSlug(null)}
              >
                Supprimer le filtre de slug
              </Badge>
            </h6>
          )}
          {visibleDocs &&
            visibleDocs.map((d, key) => (
              <h6 className="mr-auto p-2" key={key}>
                <Badge
                  pill
                  bg={d.id === selectedDocHistory.id ? "primary" : "secondary"}
                  style={{ cursor: "pointer" }}
                  onClick={() => changeHisotrySelect(d)}
                >
                  {d.titre} du projet {d.project_data.Title}
                </Badge>
              </h6>
            ))}
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="thead">
              <tr>
                <th>utilisateur</th>
                <th>Titre du document</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {histories && histories.length > 0 ? (
                histories.map((history, key) => (
                  <tr key={key}>
                    <td style={{ textAlign: "center" }}>
                      {history.user_firstname} {history.user_lastname}
                    </td>
                    <td>{history.doctitle}</td>
                    <td>{addBr(history.description)}</td>
                    <td>{history.creation_date.toString()}</td>
                    <td
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() => setSelectedSlug(history.slug)}
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
    );
  }
}
