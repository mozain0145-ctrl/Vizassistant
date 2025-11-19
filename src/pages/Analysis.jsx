import React, { useState, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie, Doughnut, Scatter } from 'react-chartjs-2';
import '../styles/Analysis.css';

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

const Analysis = () => {
  const [activeChart, setActiveChart] = useState('bar');
  const chartRef = useRef();

  const sampleData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(67, 97, 238, 0.6)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 2,
      },
      {
        label: 'Revenue',
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: 'rgba(114, 9, 183, 0.6)',
        borderColor: 'rgba(114, 9, 183, 1)',
        borderWidth: 2,
      }
    ]
  };

  const pieData = {
    labels: ['Direct', 'Social Media', 'Email', 'Referral'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: [
          '#4361ee',
          '#7209b7',
          '#4cc9f0',
          '#f72585'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const chartConfigs = {
    bar: {
      data: sampleData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sales & Revenue Analysis'
          }
        }
      }
    },
    line: {
      data: sampleData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Trends'
          }
        }
      }
    },
    pie: {
      data: pieData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Marketing Channels Distribution'
          }
        }
      }
    },
    doughnut: {
      data: pieData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Revenue Sources'
          }
        }
      }
    },
    scatter: {
      data: {
        datasets: [{
          label: 'Sales vs Revenue',
          data: [
            { x: 65, y: 28 },
            { x: 59, y: 48 },
            { x: 80, y: 40 },
            { x: 81, y: 19 },
            { x: 56, y: 86 },
            { x: 55, y: 27 }
          ],
          backgroundColor: 'rgba(67, 97, 238, 0.6)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Sales vs Revenue Correlation'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sales'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Revenue'
            }
          }
        }
      }
    }
  };

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: '📊' },
    { id: 'line', name: 'Line Chart', icon: '📈' },
    { id: 'pie', name: 'Pie Chart', icon: '🥧' },
    { id: 'doughnut', name: 'Doughnut Chart', icon: '🍩' },
    { id: 'scatter', name: 'Scatter Plot', icon: '⚫' }
  ];

  const downloadChart = () => {
    const link = document.createElement('a');
    link.download = `chart-${activeChart}.png`;
    link.href = chartRef.current.toBase64Image();
    link.click();
  };

  const renderChart = () => {
    const config = chartConfigs[activeChart];
    switch (activeChart) {
      case 'bar':
        return <Bar ref={chartRef} data={config.data} options={config.options} />;
      case 'line':
        return <Line ref={chartRef} data={config.data} options={config.options} />;
      case 'pie':
        return <Pie ref={chartRef} data={config.data} options={config.options} />;
      case 'doughnut':
        return <Doughnut ref={chartRef} data={config.data} options={config.options} />;
      case 'scatter':
        return <Scatter ref={chartRef} data={config.data} options={config.options} />;
      default:
        return <Bar ref={chartRef} data={config.data} options={config.options} />;
    }
  };

  return (
    <div className="analysis-container">
      <div className="container">
        <div className="analysis-header">
          <h1>Data Analysis & Visualization</h1>
          <p>Create interactive charts and analyze your data patterns</p>
        </div>

        <div className="analysis-content">
          <div className="chart-controls">
            <h3>Chart Types</h3>
            <div className="chart-type-buttons">
              {chartTypes.map((type) => (
                <button
                  key={type.id}
                  className={`chart-type-btn ${activeChart === type.id ? 'active' : ''}`}
                  onClick={() => setActiveChart(type.id)}
                >
                  <span className="chart-icon">{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>

            <div className="chart-actions">
              <button onClick={downloadChart} className="download-btn">
                📥 Download Chart
              </button>
            </div>
          </div>

          <div className="chart-display">
            <div className="chart-container">
              {renderChart()}
            </div>
            
            <div className="chart-info">
              <h3>Chart Insights</h3>
              <div className="insights-list">
                <div className="insight-item">
                  <strong>Pattern:</strong> Sales show seasonal trends with peaks in March and April
                </div>
                <div className="insight-item">
                  <strong>Correlation:</strong> Revenue doesn't always correlate with sales volume
                </div>
                <div className="insight-item">
                  <strong>Recommendation:</strong> Focus on high-revenue months for marketing campaigns
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="data-table">
          <h3>Sample Data</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Sales</th>
                <th>Revenue</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.labels.map((month, index) => (
                <tr key={index}>
                  <td>{month}</td>
                  <td>{sampleData.datasets[0].data[index]}</td>
                  <td>${sampleData.datasets[1].data[index]}K</td>
                  <td className={index > 0 ? 
                    (sampleData.datasets[0].data[index] > sampleData.datasets[0].data[index-1] ? 'positive' : 'negative') : ''}>
                    {index > 0 ? 
                      `${((sampleData.datasets[0].data[index] - sampleData.datasets[0].data[index-1]) / sampleData.datasets[0].data[index-1] * 100).toFixed(1)}%` 
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analysis;