import React, { useState,useRef } from "react";
import axios from "axios";
import "./UploadPDF.css"; // Import CSS
import useWindowSize from "./useWindowSize";

const UploadPDF = () => {
  const { width }=useWindowSize();
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [questionGenerated, setQuestionGenerated] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [difficulty, setDifficulty] = useState("Select");
  const [newItems, setNewItems] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const[message,setMessage]=useState("");
  const [isGenerateEnabled, setIsGenerateEnabled] = useState(false);
  const [questions,setQuestions] = useState("");
  const [showPreview,setShowPreview] = useState(false);
  const pdfurl=useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      setFileName(file.name.replace(".pdf", ""));
    }
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleAddNewItem = () => {
    const updatedItems = [...newItems, { marks: 0, questions: 0, totalMarks: 0 }];
    setNewItems(updatedItems);
    checkGenerateButton(updatedItems);
  };

  const handleInputChange = (index, field, value) => {
    let updatedValue = value.trim();

    if (updatedValue === "" || isNaN(updatedValue)) {
      updatedValue = 0;
    } else {
      updatedValue = parseInt(updatedValue, 10);
      if (updatedValue < 0) {
        alert("Negative values are not allowed!");
        updatedValue = 0;
      }
    }

    const updatedItems = [...newItems];
    updatedItems[index][field] = updatedValue;

    if (field === "marks" || field === "questions") {
      const marks = parseFloat(updatedItems[index].marks) || 0;
      const questions = parseInt(updatedItems[index].questions) || 0;
      updatedItems[index].totalMarks = marks * questions;
    }

    setNewItems(updatedItems);
    checkGenerateButton(updatedItems);
  };
  const handleGenerateQuestions = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file.");
      return;
    }
    setQuestionGenerated(true);
        try
        {
            const filedata=new FormData()
            filedata.append("pdfFile",pdfFile)
            filedata.append("fileName",fileName)
            filedata.append("difficulty",difficulty)
            filedata.append("newItems",JSON.stringify(newItems))
            
            const response=await axios.post(
                "http://127.0.0.1:5000/Pdffile",
                filedata,
               { 
                headers:{ "Content-Type": "multipart/form-data","Authorization": "Bearer AIzaSyAVHXlcL9-4WL7TRicIe8DjYjUYv_daDvw "},
               responseType:"blob"
              }
               
            );
            const content_type=response.headers['content-type'];
            if(content_type==="application/pdf")
            {
              console.log(response.data)
              const quest=new Blob([response.data],{type:"application/pdf"})
               pdfurl.current=URL.createObjectURL(quest)
              setQuestions(pdfurl.current);
               
            }
            else if(content_type==="text/plain"){
              setMessage(response.data);
            }
            else{}
        }
        catch(e)
        {
            console.log(e);
        }
    
  };


  const handleViewQuestion = () => {
      setShowPreview(true); 
    };
  const handleClosePreview = () => {
      setShowPreview(false); 
  };

  const handleDownloadQuestion = () => {
    const element = document.createElement("a");
    element.href =pdfurl.current;
    element.download = `${fileName}_question_paper.pdf`;
    document.body.appendChild(element);
    element.click();
  };

  const toggleMenu = (index) => {
    setMenuVisible((prev) => (prev === index ? null : index));
  };

  const handleDeleteItem = (indexToDelete) => {
    const updatedItems = newItems.filter((_, index) => index !== indexToDelete);
    setNewItems(updatedItems);
    setMenuVisible(null);
    checkGenerateButton(updatedItems);
  };

  const checkGenerateButton = (items) => {
    const isValid = items.some((item) => item.marks > 0 && item.questions > 0);
    setIsGenerateEnabled(isValid);
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2 className="upload-title">Upload PDF Document</h2>
        <label className="upload-icon">
          +
          <input type="file" accept="application/pdf" onChange={handleFileChange} hidden />
        </label>

        {fileName && <p className="file-name">{fileName}.pdf</p>}

        <select className="difficulty-dropdown" value={difficulty} onChange={handleDifficultyChange}>
          <option value="Select">Select</option>
          <option value="Equally">Equally</option>
          <option value="Random">Random</option>
        </select>

        {/* Dynamic Items List */}
        {newItems.map((item, index) => (
          <div key={index} className="item-box">
            <input
              type="text"
              placeholder="Marks category eg-2,5,16"
              className="item-input"
              value={item.marks || ""}
              onChange={(e) => handleInputChange(index, "marks", e.target.value)}
            />
            <input
              type="text"
              placeholder="No. of Questions"
              className="item-input"
              value={item.questions || ""}
              onChange={(e) => handleInputChange(index, "questions", e.target.value)}
            />
            <span className="total-marks">Total: {item.totalMarks}</span>

            {/* Ellipsis Menu */}
            <div className="menu-container">
              <span className="ellipsis" onClick={() => toggleMenu(index)}>⋮</span>
              {menuVisible === index && (
                <span className="delete-icon" onClick={() => handleDeleteItem(index)}>🗑</span>
              )}
            </div>
          </div>
        ))}

        {(difficulty === "Equally" || difficulty === "Random") && (
          <button onClick={handleAddNewItem} className="new-item-button">
            + New Item
          </button>
        )}

        <button
          onClick={handleGenerateQuestions}
          className={`upload-button ${isGenerateEnabled ? "" : "disabled"}`}
          disabled={!isGenerateEnabled}
        >
          Generate Questions
        </button>
      </div>
      
      {questionGenerated && (
        <div className="bottom-box">
          <div className="title-box">{fileName} Question Paper ({difficulty})</div>
          <div className="button-box">
            <button onClick={handleViewQuestion} className="view-button">
              {showQuestion ? "Hide" : "View"}
            </button>
            <button onClick={handleDownloadQuestion} className="download-button">
              Download
            </button>
          </div>
        </div>
      )}
    {showPreview && (
         <div className="popup-overlay" onClick={handleClosePreview}>
         <div className="popup-content" onClick={(e) => e.stopPropagation()}>
           <span className="close-button" onClick={handleClosePreview}>&times;</span>
           <iframe src={questions} title="Question Paper Preview" className="pdf-viewer"></iframe>
         </div>
       </div>
      )}
    </div>
  );
};

export default UploadPDF;


