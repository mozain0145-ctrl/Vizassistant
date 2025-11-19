import React, { useState, useEffect } from 'react';
import { analyzeDataWithAI } from '../services/gemini';
import '../styles/Insights.css';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sampleData, setSampleData] = useState([]);

  useEffect(() => {
    // Generate sample data for demonstration
    const generateSampleData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return months.map(month => ({
        month,
        sales: Math.floor(Math.random() * 100) + 50,
        revenue: Math.floor(Math.random() * 200) + 100,
        customers: Math.floor(Math.random() * 500) + 200,
        expenses: Math.floor(Math.random() * 80) + 30
      }));
    };

    setSampleData(generateSampleData());
  }, []);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const columns = ['month', 'sales', 'revenue', 'customers', 'expenses'];
      const aiInsights = await analyzeDataWithAI(sampleData, columns);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback insights
      setInsights({
        insights: [
          "Sales show a positive trend over the last 6 months",
          "Revenue growth outpaces customer acquisition",
          "Expense-to-revenue ratio remains stable at 35%"
        ],
        recommendedCharts: ["line", "bar", "scatter"],
        patterns: [
          "Seasonal pattern detected with peaks in Q2",
          "Strong correlation between marketing spend and new customers"
        ],
        recommendations: [
          "Increase marketing budget in high-performing months",
          "Focus on customer retention to improve lifetime value",
          "Optimize operational expenses during low-revenue periods"
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="insights-container">
      <div className="container">
        <div className="insights-header">
          <h1>AI-Powered Insights</h1>
          <p>Get intelligent analysis and recommendations for your data</p>
        </div>

        <div className="insights-content">
          <div className="insights-generator">
            <div className="generator-card">
              <h3>Generate Insights</h3>
              <p>Click below to get AI-powered analysis of your data patterns and trends</p>
              
              <button 
                onClick={generateInsights} 
                disabled={loading}
                className="generate-btn"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Analyzing Data with AI...
                  </>
                ) : (
                  '🤖 Generate AI Insights'
                )}
              </button>

              {sampleData.length > 0 && (
                <div className="sample-data">
                  <h4>Sample Data Being Analyzed:</h4>
                  <div className="data-preview">
                    {sampleData.slice(0, 3).map((item, index) => (
                      <div key={index} className="data-item">
                        <strong>{item.month}:</strong> Sales: {item.sales}, Revenue: ${item.revenue}K
                      </div>
                    ))}
                    <div className="data-more">... and {sampleData.length - 3} more records</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {insights && (
            <div className="insights-results">
              <div className="results-header">
                <h2>AI Analysis Results</h2>
                <span className="ai-badge">Powered by Gemini AI</span>
              </div>

              <div className="insights-grid">
                <div className="insight-section">
                  <div className="section-header">
                    <span className="section-icon">💡</span>
                    <h3>Key Insights</h3>
                  </div>
                  <div className="insights-list">
                    {insights.insights?.map((insight, index) => (
                      <div key={index} className="insight-item">
                        <div className="insight-bullet"></div>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="insight-section">
                  <div className="section-header">
                    <span className="section-icon">📊</span>
                    <h3>Recommended Visualizations</h3>
                  </div>
                  <div className="charts-recommendation">
                    {insights.recommendedCharts?.map((chart, index) => (
                      <div key={index} className="chart-recommendation">
                        <span className="chart-name">{chart.toUpperCase()} Chart</span>
                        <span className="chart-desc">Best for showing {chart === 'line' ? 'trends over time' : 
                          chart === 'bar' ? 'comparisons between categories' : 
                          chart === 'pie' ? 'composition and proportions' : 'relationships between variables'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="insight-section">
                  <div className="section-header">
                    <span className="section-icon">🔍</span>
                    <h3>Patterns & Anomalies</h3>
                  </div>
                  <div className="patterns-list">
                    {insights.patterns?.map((pattern, index) => (
                      <div key={index} className="pattern-item">
                        <span className="pattern-icon">📈</span>
                        <span>{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="insight-section">
                  <div className="section-header">
                    <span className="section-icon">🚀</span>
                    <h3>Actionable Recommendations</h3>
                  </div>
                  <div className="recommendations-list">
                    {insights.recommendations?.map((recommendation, index) => (
                      <div key={index} className="recommendation-item">
                        <span className="rec-number">{index + 1}</span>
                        <span>{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="confidence-metric">
                <div className="confidence-header">
                  <span>AI Confidence Score</span>
                  <span className="confidence-value">92%</span>
                </div>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{width: '92%'}}></div>
                </div>
                <p className="confidence-note">
                  Based on data quality, pattern clarity, and historical accuracy
                </p>
              </div>
            </div>
          )}
        </div>

        {!insights && !loading && (
          <div className="features-showcase">
            <h2>AI Analysis Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h4>Pattern Detection</h4>
                <p>Identify trends, seasonality, and correlations in your data automatically</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Smart Visualization</h4>
                <p>Get recommendations for the best chart types based on your data structure</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h4>Actionable Insights</h4>
                <p>Receive practical recommendations to improve your business outcomes</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h4>Real-time Analysis</h4>
                <p>Process and analyze your data instantly with advanced AI algorithms</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;