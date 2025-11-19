// src/pages/DataUpload.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { analyzeDataWithAI } from '../services/gemini';
import { storage } from '../services/firebase'; // Fixed import
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/DataUpload.css';
import DataCleaning from '../components/DataCleaning';

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDataCleaning, setShowDataCleaning] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setAnalysis(null); // Reset previous analysis
    const fileType = uploadedFile.name.split('.').pop().toLowerCase();

    {columns.length > 0 && (
  <div className="data-actions">
    <button 
      onClick={() => setShowDataCleaning(true)}
      className="cleaning-btn"
    >
      🧹 Clean & Prepare Data
    </button>
  </div>
)}
 {showDataCleaning && (
  <DataCleaning 
    data={data}
    columns={columns}
    onDataCleaned={(cleanedData) => {
      setData(cleanedData);
      setShowDataCleaning(false);
    }}
  />
)}

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      
      try {
        let parsedData = [];
        let parsedColumns = [];

        if (fileType === 'csv') {
          const result = Papa.parse(content, { 
            header: true,
            skipEmptyLines: true 
          });
          parsedData = result.data;
          parsedColumns = result.meta.fields || [];
        } else if (fileType === 'xlsx' || fileType === 'xls') {
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet);
          parsedColumns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];
        } else if (fileType === 'json') {
          parsedData = JSON.parse(content);
          if (!Array.isArray(parsedData)) {
            throw new Error('JSON file should contain an array of objects');
          }
          parsedColumns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];
        }

        // Clean the data (remove empty rows)
        parsedData = parsedData.filter(row => {
          return Object.values(row).some(value => value !== null && value !== undefined && value !== '');
        });

        setData(parsedData);
        setColumns(parsedColumns);
        
        if (parsedData.length === 0) {
          alert('No valid data found in the file');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file: ' + error.message);
      }
    };

    if (fileType === 'csv' || fileType === 'json') {
      reader.readAsText(uploadedFile);
    } else {
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const saveToFirebase = async (file) => {
    try {
      const storageRef = ref(storage, `datasets/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      return null;
    }
  };

  const analyzeData = async () => {
    if (data.length === 0) {
      alert('Please upload a valid file with data first');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Save file to Firebase (optional)
      let fileUrl = null;
      if (file) {
        fileUrl = await saveToFirebase(file);
      }

      const aiAnalysis = await analyzeDataWithAI(data, columns);
      setAnalysis(aiAnalysis);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => setUploadProgress(0), 2000);
      
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again. Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDataPreview = () => {
    if (data.length === 0) return null;

    return (
      <div className="data-preview">
        <h3>Data Preview (First 5 rows)</h3>
        <div className="preview-table-container">
          <table className="preview-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 5 && (
          <p className="preview-note">... and {data.length - 5} more rows</p>
        )}
      </div>
    );
  };

  return (
    <div className="data-upload-container">
      <div className="container">
        <div className="upload-header">
          <h1>Upload Your Data</h1>
          <p>Upload CSV, Excel, or JSON files for AI-powered analysis</p>
        </div>

        <div className="upload-card">
          <div className="upload-area">
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileUpload}
              className="file-input"
            />
            <label htmlFor="file-upload" className="upload-label">
              <div className="upload-icon">📁</div>
              <p>Choose a file or drag and drop here</p>
              <span className="file-types">CSV, XLSX, JSON supported</span>
            </label>
          </div>

          {uploadProgress > 0 && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          {file && (
            <div className="file-info">
              <h3>Selected File: {file.name}</h3>
              <p>Rows: {data.length} | Columns: {columns.length} | Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          {columns.length > 0 && (
            <div className="columns-preview">
              <h3>Data Columns:</h3>
              <div className="columns-list">
                {columns.map((col, index) => (
                  <span key={index} className="column-tag">
                    {col} 
                    <span className="column-type">
                      ({typeof data[0][col] === 'number' ? 'number' : 'text'})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {renderDataPreview()}

          <button 
            onClick={analyzeData} 
            disabled={loading || data.length === 0}
            className="analyze-btn"
          >
            {loading ? (
              <>
                <div className="loading-spinner-small"></div>
                Analyzing with AI...
              </>
            ) : (
              '🤖 Analyze Data with AI'
            )}
          </button>
        </div>

        {analysis && (
          <div className="analysis-results">
            <h2>🎯 AI Analysis Results</h2>
            
            <div className="insights-grid">
              <div className="insight-card">
                <div className="card-header">
                  <span className="card-icon">💡</span>
                  <h3>Key Insights</h3>
                </div>
                <ul>
                  {analysis.insights?.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                  {(!analysis.insights || analysis.insights.length === 0) && (
                    <li>No specific insights generated</li>
                  )}
                </ul>
              </div>

              <div className="insight-card">
                <div className="card-header">
                  <span className="card-icon">📊</span>
                  <h3>Recommended Charts</h3>
                </div>
                <div className="charts-list">
                  {analysis.recommendedCharts?.map((chart, index) => (
                    <span key={index} className="chart-tag">
                      {chart}
                    </span>
                  ))}
                  {(!analysis.recommendedCharts || analysis.recommendedCharts.length === 0) && (
                    <span className="chart-tag">Bar Chart</span>
                  )}
                </div>
              </div>

              <div className="insight-card">
                <div className="card-header">
                  <span className="card-icon">🔍</span>
                  <h3>Patterns Detected</h3>
                </div>
                <ul>
                  {analysis.patterns?.map((pattern, index) => (
                    <li key={index}>{pattern}</li>
                  ))}
                  {(!analysis.patterns || analysis.patterns.length === 0) && (
                    <li>No specific patterns detected</li>
                  )}
                </ul>
              </div>

              <div className="insight-card">
                <div className="card-header">
                  <span className="card-icon">🚀</span>
                  <h3>Recommendations</h3>
                </div>
                <ul>
                  {analysis.recommendations?.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                  {(!analysis.recommendations || analysis.recommendations.length === 0) && (
                    <li>Consider exploring different data visualizations</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="analysis-actions">
              <button className="action-btn primary">
                📈 Create Charts
              </button>
              <button className="action-btn secondary">
                💾 Save Analysis
              </button>
              <button 
                className="action-btn accent"
                onClick={() => setAnalysis(null)}
              >
                🔄 New Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;