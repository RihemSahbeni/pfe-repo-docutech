import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import Element from './Element';
import CodeElement from './CodeElement';
import ImageElement from './ImageElement';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./model.css";
import { CopyBlock } from 'react-code-blocks';
import { CodeBlock, a11yDark } from "react-code-blocks";
import ElementEditor from './ElementEditor';
import { config_paragraphe, config_soustitre, config_tableau, config_titre } from './configElements';
import { saveAs } from 'file-saver';
import {addHistorique} from '../../Api/HistoryApi';

const Model = ({ notifParentaboutnavbar }) => {

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [preview, setPreviewMode] = useState(false);
  const [isModelorDoc, setisModelorDoc] = useState("Model");
  const [ElementToEdit, setElementToEdit] = useState(null);
  const [PdfMode, setPdfMode] = useState(false);
  const [docData, setDocData] = useState(null);
  const [WordMode, setWordMode] = useState(false);
  const componentRef = useRef(null);
  
  const targetPDRef = useRef(null);

  const apibase = "http://127.0.0.1:8000/api/elements"
  const navigate = useNavigate();

  const location = useLocation();
  const id = location.state?.id;

  const items = [
    { itemId: uuid(), content: 'Titre', element: <Element config={config_titre} notifParentAdd={getNotifAdd} /> },
    { itemId: uuid(), content: 'Sous-titre', element: <Element config={config_soustitre} notifParentAdd={getNotifAdd} /> },
    { itemId: uuid(), content: 'Paragraphe', element: <Element config={config_paragraphe} notifParentAdd={getNotifAdd} /> },
    { itemId: uuid(), content: 'Code', element: <CodeElement notifParentAdd={getNotifAdd} /> },
    /*{
      itemId: uuid(), content: 'BreakPage', element: <div style={{ height: '150px' }}>BREAK PAGE</div>

    },*/
    { itemId: uuid(), content: 'Image', element: <ImageElement notifParentAdd={getNotifAdd} /> },
    { itemId: uuid(), content: 'Tableau', element: <Element config={config_tableau} notifParentAdd={getNotifAdd} /> },


  ];

  const [docs, setDocs] = useState([
  ])
  const [elements, setElements] = useState([]);
  function fetchElements() {
    axios.get(`${apibase}/doc/${id}`, config).then((res) => setElements(res.data))

  }
  function goBack(){
    navigate(-1);
  }
  function fetchDoc() {
    axios.get(`http://127.0.0.1:8000/api/doc/${id}`, config).then((res) => {
      console.log(res);
      if (res.data.project) {
        setisModelorDoc("Doc");
      } else {
        setisModelorDoc("Model");
      }
      setDocData(res.data)
    })

  }
  function getNotifFromEdit() {
    addToHistory("Modification","Modification d'un element dans le document");
    setElementToEdit(null);
    fetchElements();


  }
  async function addToHistory(slug,description){
    await addHistorique({
      docId:id,
      description:description,
      slug:slug
    })

  }
  function getNotifAdd(content, graphid, elementtype) {
    let sequence = elements.length;

    let typeofvalue
    let value
    if (elementtype == "Code") {
      typeofvalue = content[1];
      value = content[0];

    } else if (elementtype == "Image") {
      typeofvalue = "Imagedata";
      value = content;
    }
    else {
      typeofvalue = "__html";
      value = content;
    }




    axios.post(`${apibase}/doc/${id}`, {
      sequence: sequence + 1,
      typeofvalue: typeofvalue,
      type: elementtype,
      value: value
    }, config).then((reponse) => {
      fetchElements()
      let newDocs = docs;
      newDocs = newDocs.filter((d) => d.docId != graphid);
      setDocs(newDocs);
      addToHistory("Ajout","ajout d'un nouvel élément dans le document : ");
    }
    );

  }

  function deleteElement(element) {
    axios.delete(`${apibase}/delete/${element.id}`, config).then(
      (reponse) => {fetchElements();
            addToHistory("Suppression","Suppression d'un élément dans le document : ")}

    )
  }
  function generateHtmlData() {
    const content = document.querySelector('#pdfComp').innerHTML; //get HTML from comp


    const html = `
    <html>
    <head>
      <style>
        body {
          width:100%;
                    margin: 0;
        }
        
        .element-preview {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          margin: 10mm auto;
        }
      </style>
    </head>
    <body>
      <div class='element-preview'>
        ${content}
      </div>
    </body>
  </html>`;
    return html
  }
  async function generateFileFromComp(fileType) {
    const html = generateHtmlData();
    const requestConfig = {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob'
    };
    axios.post("http://localhost:5000/api/generate-doc",
      {
        content: html,
        type:fileType
      }, requestConfig,
    ).then((rep) =>{
        
       saveAs(rep.data, docData.titre + "-" + docData.type + "-" + new Date().toDateString() + "."+fileType)}
    )


  }

  useEffect(() => {
    if (!id) {
      console.log("id not found");
      navigate("/ModelHome");
    } else {
      fetchDoc();
      fetchElements();


    }

  }, [])


  const handleDragEnd = (result) => {


    if (!result.destination) {
      return;
    }
    if (result.destination.droppableId === result.source.droppableId && result.destination.droppableId == "main") {


      let element1 = elements[elements.findIndex(e => e.sequence == result.source.index)];
      let element2 = elements[elements.findIndex(e => e.sequence == result.destination.index)];
      axios.put(`${apibase}/update-element/${element1.id}`, {
        sequence: element2.sequence
      }, config).then((reponse) => {
        axios.put(`${apibase}/update-element/${element2.id}`, {
          sequence: element1.sequence
        }, config).then((reponse2) => {
          setElements(null);
          fetchElements();
                addToHistory("Modification","Modification de l'emplacement d'un élément dans le document : ");

          return;

        })
      })
    } else {
      if (result.destination.droppableId == "main") {

        let item = items.find(item => item.itemId == result.draggableId);
        let docElementId = uuid();
        const newElement = { ...item.element, props: { ...item.element.props, graphid: docElementId, elementtype: item.content } };
        let newitem = {
          docId: docElementId,
          element: newElement,

          content: item.content
        }
        console.log(newitem);

        setDocs(prev => [...prev, newitem]);
      }
    }

  };



  return (
    <div>

      <div className='mt-5'>
        {!preview && !PdfMode && !WordMode &&
          <DragDropContext onDragEnd={handleDragEnd}>
            <>
              <aside id="sidebar" class="sidebar">

                <Droppable droppableId="sidebar">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >

                      {items &&
                        <ul class="sidebar-nav" id="sidebar-nav">

                          {items.map((item, index) => (
                            <Draggable key={index} draggableId={item.itemId} index={index} >
                              {(provided) => (

                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <li class="nav-item">
                                    <a class="nav-link collapsed" href="#">
                                      {item.content === 'Titre' && <i className="bi bi-card-heading"></i>}
                                      {item.content === 'Sous-titre' && <i className="bi bi-filter-square"></i>}
                                      {item.content === 'Paragraphe' && <i class="bi bi-card-text"></i>}
                                      {item.content === 'Code' && <i class="bi bi-code-square"></i>}
                                      {item.content === 'Image' && <i className="bi bi-card-image"></i>}
                                      {item.content === 'Tableau' && <i className="bi bi-grid-3x3"></i>}
                                      {/*item.content === 'BreakPage' && <i className="bi bi-hr"></i>*/}
                                      <span>{item.content}</span>
                                    </a>
                                  </li>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          <li className='nav-item'>
                            <a onClick={goBack} class="nav-link collapsed"><i className="bi bi-arrow-left"></i> Retour</a>

                          </li>
                        </ul>}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </aside>
              <main id="main" class="main"  >
                <div className='row'>

                  <button className='ms-3 col-2 btn btn-primary' onClick={() => { setPreviewMode(true); notifParentaboutnavbar(false) }}>Aperçu</button>
                  {isModelorDoc === "Doc" &&
                    <>
                      <button className='ms-3 col-2 btn btn-danger' onClick={() => { setPdfMode(true); notifParentaboutnavbar(false) }}>
                        <i class="bi bi-file-earmark-pdf me-1"></i>
                        Generate PDF  </button>
                      <button className='ms-3 col-3 btn btn-primary'
                        style={{ backgroundColor: '#255499', color: 'white' }}
                        onClick={() => { setWordMode(true); notifParentaboutnavbar(false) }}>
                        <i class="bi bi-filetype-doc me-1" ></i>
                        Generate Word Doc
                      </button>
                    </>
                  }
                </div>
                <div style={{ height: '800px', overflowY: 'auto' }}>
                  <Droppable droppableId="main">
                    {(provided, snapshot) => (
                      <div

                        ref={provided.innerRef}
                        {...provided.droppableProps}

                        style={{
                          width: '100%', padding: '16px',
                          backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'white',
                        }}
                      >
                        {elements &&
                          elements.sort((a, b) => a.sequence - b.sequence).map((element, index) =>
                            ((ElementToEdit != null && ElementToEdit.id != element.id) || ElementToEdit == null) ? (
                              <Draggable key={index} draggableId={element.id.toString()} index={element.sequence} >
                                {(provided) => (

                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                  >
                                    <div className="d-flex flex-row-reverse">
                                      <i class="bi bi-trash" onClick={() => deleteElement(element)}></i>

                                      <i class="bi bi-pencil-square" onClick={() => setElementToEdit(element)}></i>
                                    </div>
                                    <div className='elemnt-div mb-2'>
                                      {element.typeofvalue == "__html" &&
                                        <div dangerouslySetInnerHTML={{
                                          __html: element.value.data
                                        }} />
                                      }
                                      {element.type == "Code" &&
                                        <CopyBlock
                                          text={element.value.data}
                                          language={element.typeofvalue}
                                          showLineNumbers={true}
                                          theme='atom-one-dark'
                                          startingLineNumber={1}
                                          codeBlock={{ lineNumbers: false, wrapLines: true }}
                                        />
                                      }
                                      {element.type == "Image" &&
                                        <img src={element.value.data} />
                                      }
                                    </div>
                                  </div>

                                )}

                              </Draggable>
                            ) : (
                              <ElementEditor element={ElementToEdit} back={getNotifFromEdit} />
                            )
                          )
                        }
                        {!elements &&
                          <i>loading..</i>
                        }
                        {docs &&
                          docs.map((doc, index) =>
                            <Draggable key={index} draggableId={doc.docId} index={index} isDragDisabled={doc.content == 'Image'}>
                              {(provided) => (

                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  {doc.element}
                                </div>

                              )}
                            </Draggable>


                          )}


                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>


                </div>

              </main>
            </>

          </DragDropContext>
        }
        {preview &&
          <div >
            <button className='col-2 btn btn-primary' onClick={() => { setPreviewMode(false); notifParentaboutnavbar(true) }}>Fermer Aperçu</button>


            <div className='element-preview' >
              <div ref={componentRef} >

                {elements.sort((a, b) => a.sequence - b.sequence).map((element, key) =>
                  <>
                    {element.typeofvalue == "__html" &&
                      <div dangerouslySetInnerHTML={{
                        __html: element.value.data
                      }} />
                    }
                    {element.type == "Code" &&
                      <CodeBlock

                        text={element.value.data}
                        language={element.typeofvalue}
                        showLineNumbers={true}
                        theme={a11yDark}
                        startingLineNumber={1}
                        codeBlock={{ lineNumbers: true, wrapLines: false }}
                      />
                    }
                    {element.type == "Image" &&
                      <>
                        <img src={element.value.data} /> <br />
                      </>
                    }
                  </>
                )}
              </div>
            </div>
          </div>
        }
        {PdfMode || WordMode ? (
          <>
          
          {elements &&
              <>
                <div className='row col-8 mt-3 mx-auto' >

                  <div className='row'>

                    {PdfMode &&
                      <>
                        <button className='btn btn-secondary col-3 me-3' onClick={() => { setPdfMode(false); notifParentaboutnavbar(true) }} >Fermer</button>

                        <button className='btn btn-danger col-3' onClick={() => generateFileFromComp("pdf")}>Telecharger</button>
                      </>
                    }
                    {WordMode &&
                      <>
                        <button className='btn btn-secondary col-3 me-3' onClick={() => { setWordMode(false); notifParentaboutnavbar(true) }} >Fermer</button>

                        <button className='btn btn-danger col-3' style={{ backgroundColor: '#255499', color: 'white' }}
                          onClick={() => generateFileFromComp("docx")}>Telecharger</button>
                      </>
                    }
                  </div>

                  <div className='row mt-2' style={{ "backgroundColor": "white" }} >


                    <div id="pdfComp" ref={targetPDRef}>

                      {elements.sort((a, b) => a.sequence - b.sequence).map((element, index) =>
                        <div className='my-2'>
                          {element.typeofvalue == "__html" &&
                            <div dangerouslySetInnerHTML={{
                              __html: element.value.data
                            }} />
                          }
                          {element.type == "Code" &&
                            <CopyBlock
                              text={element.value.data}
                              language={element.typeofvalue}
                              showLineNumbers={true}
                              theme='atom-one-dark'
                              startingLineNumber={1}
                              codeBlock={{ lineNumbers: false, wrapLines: true }}
                            />
                          }
                          {element.type == "Image" &&
                            <img src={element.value.data} />
                          }
                        </div>
                      )
                      }
                    </div>
                  </div>
                </div>
              </>

            }
          </>
        ) : (
          <>
          </>
        )}
      </div></div>
  );
};
export default Model;