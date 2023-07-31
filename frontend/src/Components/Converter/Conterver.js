import React, { useState } from 'react';
import axios from 'axios';

function Converter() {


  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('pdf_content', file); // Make sure the field name is 'pdf_content'

      const response = await axios.post('http://localhost:8000/convert/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setHtmlContent(response.data.html_content);
    } catch (error) {
      console.error('Error converting PDF:', error);
    }
  };

  return (
    <div className="container">
      <main>
        <br/>  <br/><br/>  <br/><br/>  
        <input type="file" onChange={handleChange} />
        <button onClick={handleSubmit}>Upload and Convert</button>

        {htmlContent && (
          <div>
            <h2>Converted HTML Content</h2>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
          </div>
        )}
      </main>
    </div>
  );
};


export default Converter;
