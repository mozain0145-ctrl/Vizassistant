// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [recentFiles, setRecentFiles] = useState([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalAnalyses: 0,
    chartsCreated: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Mock data for demonstration
    setRecentFiles([
      { name: 'sales_data.csv', date: '2024-01-15', size: '2.4 MB' },
      { name: 'customer_data.xlsx', date: '2024-01-14', size: '1.8 MB' },
      { name: 'marketing_campaign.json', date: '2024-01-13', size: '1.2 MB' }
    ]);

    setStats({
      totalFiles: 12,
      totalAnalyses: 8,
      chartsCreated: 15
    });
  };

  const sampleChartData = {
    bar: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Sales',
          data: [65, 59, 80, 81, 56],
          backgroundColor: '#4361ee',
        },
      ],
    },
    line: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Revenue',
          data: [65, 59, 80, 81, 56],
          borderColor: '#7209b7',
          backgroundColor: 'rgba(114, 9, 183, 0.1)',
        },
      ],
    },
    pie: {
      labels: ['Direct', 'Social', 'Referral'],
      datasets: [
        {
          data: [55, 25, 20],
          backgroundColor: ['#4361ee', '#7209b7', '#4cc9f0'],
        },
      ],
    },
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
          <p>Here's an overview of your data analysis activities</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats.totalFiles}</h3>
              <p>Total Files</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🤖</div>
            <div className="stat-info">
              <h3>{stats.totalAnalyses}</h3>
              <p>AI Analyses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>{stats.chartsCreated}</h3>
              <p>Charts Created</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/upload" className="action-btn primary">
              📁 Upload New Data
            </Link>
            <Link to="/analysis" className="action-btn secondary">
              📊 Create Chart
            </Link>
            <Link to="/insights" className="action-btn accent">
              🤖 Get AI Insights
            </Link>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="recent-files">
            <h2>Recent Files</h2>
            <div className="files-list">
              {recentFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <h4>{file.name}</h4>
                    <p>Uploaded: {file.date} • {file.size}</p>
                  </div>
                  <Link to="/analysis" className="action-btn small">
                    Analyze
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-previews">
            <h2>Chart Examples</h2>
            <div className="charts-grid">
              <div className="chart-preview">
                <h4>Bar Chart</h4>
                <Bar data={sampleChartData.bar} options={{ responsive: true }} />
              </div>
              <div className="chart-preview">
                <h4>Line Chart</h4>
                <Line data={sampleChartData.line} options={{ responsive: true }} />
              </div>
              <div className="chart-preview">
                <h4>Pie Chart</h4>
                <Pie data={sampleChartData.pie} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </div>

        <div className="getting-started">
          <h2>Getting Started</h2>
          <div className="getting-started-grid">
            <div className="guide-card">
              <div className="guide-icon">📁</div>
              <h3>Upload Your Data</h3>
              <p>Start by uploading your CSV, Excel, or JSON files to begin analysis.</p>
              <Link to="/upload" className="guide-link">
                Upload Data →
              </Link>
            </div>
            <div className="guide-card">
              <div className="guide-icon">🤖</div>
              <h3>Get AI Insights</h3>
              <p>Let our AI analyze your data and provide intelligent recommendations.</p>
              <Link to="/insights" className="guide-link">
                Get Insights →
              </Link>
            </div>
            <div className="guide-card">
              <div className="guide-icon">📈</div>
              <h3>Create Visualizations</h3>
              <p>Build beautiful charts and dashboards to showcase your data.</p>
              <Link to="/analysis" className="guide-link">
                Create Charts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;