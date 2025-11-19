// src/components/DataCleaning.jsx
import React, { useState } from 'react';
import { DataCleaningService, ExternalDataCleaningAPIs } from '../services/dataCleaning';
import '../styles/DataCleaning.css';

const DataCleaning = ({ data, columns, onDataCleaned }) => {
  const [cleaningOptions, setCleaningOptions] = useState({
    removeDuplicates: true,
    handleMissingValues: 'remove', // 'remove' or 'fill'
    standardizeValues: true,
    validateTypes: true
  });
  
  const [cleaningResults, setCleaningResults] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions');

  const getAISuggestions = async () => {
    setLoading(true);
    try {
      const suggestions = await DataCleaningService.getAICleaningSuggestions(data, columns);
      setAiSuggestions(suggestions);
      setActiveTab('suggestions');
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanData = async () => {
    setLoading(true);
    try {
      const results = await DataCleaningService.cleanDataset(data, columns, cleaningOptions);
      setCleaningResults(results);
      setActiveTab('results');
      
      // Pass cleaned data back to parent
      if (onDataCleaned) {
        onDataCleaned(results.cleanedData);
      }
    } catch (error) {
      console.error('Data cleaning failed:', error);
      alert('Data cleaning failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCleanedData = () => {
    if (!cleaningResults) return;
    
    const csvContent = [
      columns.join(','),
      ...cleaningResults.cleanedData.map(row => 
        columns.map(col => `"${row[col] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cleaned_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="data-cleaning-container">
      <div className="cleaning-header">
        <h2>🧹 Data Cleaning & Preprocessing</h2>
        <p>Clean and prepare your data for analysis using AI-powered tools</p>
      </div>

      <div className="cleaning-content">
        <div className="cleaning-sidebar">
          <div className="cleaning-options">
            <h3>Cleaning Options</h3>
            
            <div className="option-group">
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={cleaningOptions.removeDuplicates}
                  onChange={(e) => setCleaningOptions({
                    ...cleaningOptions,
                    removeDuplicates: e.target.checked
                  })}
                />
                <span className="checkmark"></span>
                Remove Duplicate Records
              </label>
            </div>

            <div className="option-group">
              <label>Handle Missing Values:</label>
              <select
                value={cleaningOptions.handleMissingValues}
                onChange={(e) => setCleaningOptions({
                  ...cleaningOptions,
                  handleMissingValues: e.target.value
                })}
              >
                <option value="remove">Remove Rows with Missing Values</option>
                <option value="fill">Fill Missing Values Automatically</option>
                <option value="keep">Keep as Is</option>
              </select>
            </div>

            <div className="option-group">
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={cleaningOptions.standardizeValues}
                  onChange={(e) => setCleaningOptions({
                    ...cleaningOptions,
                    standardizeValues: e.target.checked
                  })}
                />
                <span className="checkmark"></span>
                Standardize Values (trim, format)
              </label>
            </div>

            <div className="option-group">
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={cleaningOptions.validateTypes}
                  onChange={(e) => setCleaningOptions({
                    ...cleaningOptions,
                    validateTypes: e.target.checked
                  })}
                />
                <span className="checkmark"></span>
                Validate & Convert Data Types
              </label>
            </div>
          </div>

          <div className="cleaning-actions">
            <button 
              onClick={getAISuggestions}
              disabled={loading}
              className="btn-secondary"
            >
              🤖 Get AI Suggestions
            </button>
            
            <button 
              onClick={cleanData}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Cleaning...' : '🚀 Clean Data Now'}
            </button>
          </div>
        </div>

        <div className="cleaning-main">
          <div className="results-tabs">
            <button 
              className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              AI Suggestions
            </button>
            <button 
              className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Cleaning Results
            </button>
            <button 
              className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Data Preview
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'suggestions' && (
              <div className="suggestions-content">
                {aiSuggestions ? (
                  <div className="ai-suggestions">
                    <div className="suggestion-header">
                      <h3>AI-Powered Cleaning Recommendations</h3>
                      <div className="confidence-badge">
                        Confidence: {aiSuggestions.confidence}%
                      </div>
                    </div>
                    
                    <div className="priority-indicator">
                      Priority: <span className={`priority-${aiSuggestions.priority}`}>
                        {aiSuggestions.priority}
                      </span>
                    </div>

                    <div className="suggestions-grid">
                      <div className="suggestion-card issues">
                        <h4>📋 Identified Issues</h4>
                        <ul>
                          {aiSuggestions.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="suggestion-card actions">
                        <h4>🛠️ Recommended Actions</h4>
                        <ul>
                          {aiSuggestions.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="estimation">
                      <strong>Estimated Time:</strong> {aiSuggestions.estimatedTime}
                    </div>
                  </div>
                ) : (
                  <div className="no-suggestions">
                    <div className="suggestion-placeholder">
                      <div className="placeholder-icon">🤖</div>
                      <h3>Get AI-Powered Cleaning Suggestions</h3>
                      <p>Click the "Get AI Suggestions" button to receive intelligent recommendations for cleaning your data.</p>
                      <button 
                        onClick={getAISuggestions}
                        className="btn-primary"
                      >
                        Generate Suggestions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'results' && (
              <div className="results-content">
                {cleaningResults ? (
                  <div className="cleaning-results">
                    <div className="results-header">
                      <h3>Data Cleaning Complete! 🎉</h3>
                      <div className="quality-score">
                        Data Quality Score: 
                        <span className={`score-${Math.floor(cleaningResults.qualityScore / 25)}`}>
                          {cleaningResults.qualityScore}%
                        </span>
                      </div>
                    </div>

                    <div className="results-stats">
                      <div className="stat-card">
                        <div className="stat-value">{cleaningResults.originalCount}</div>
                        <div className="stat-label">Original Rows</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{cleaningResults.finalCount}</div>
                        <div className="stat-label">Cleaned Rows</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{cleaningResults.cleaningReport.removedDuplicates}</div>
                        <div className="stat-label">Duplicates Removed</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{cleaningResults.cleaningReport.filledMissingValues}</div>
                        <div className="stat-label">Missing Values Handled</div>
                      </div>
                    </div>

                    <div className="cleaning-details">
                      <h4>Cleaning Actions Performed:</h4>
                      <ul>
                        {cleaningResults.cleaningReport.removedDuplicates > 0 && (
                          <li>✅ Removed {cleaningResults.cleaningReport.removedDuplicates} duplicate records</li>
                        )}
                        {cleaningResults.cleaningReport.filledMissingValues > 0 && (
                          <li>✅ Filled {cleaningResults.cleaningReport.filledMissingValues} missing values</li>
                        )}
                        {cleaningResults.cleaningReport.standardizedValues > 0 && (
                          <li>✅ Standardized {cleaningResults.cleaningReport.standardizedValues} values</li>
                        )}
                        {cleaningResults.cleaningReport.correctedDataTypes > 0 && (
                          <li>✅ Corrected {cleaningResults.cleaningReport.correctedDataTypes} data types</li>
                        )}
                      </ul>
                    </div>

                    <div className="results-actions">
                      <button onClick={downloadCleanedData} className="btn-success">
                        📥 Download Cleaned Data
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="no-results">
                    <div className="results-placeholder">
                      <div className="placeholder-icon">🧹</div>
                      <h3>Clean Your Data</h3>
                      <p>Configure your cleaning options and click "Clean Data Now" to start the data cleaning process.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="preview-content">
                <h3>Data Preview (First 10 Rows)</h3>
                <div className="data-preview">
                  <table className="preview-table">
                    <thead>
                      <tr>
                        {columns.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 10).map((row, rowIndex) => (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCleaning;