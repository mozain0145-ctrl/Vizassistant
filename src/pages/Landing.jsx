// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Get instant insights with our advanced AI that automatically detects patterns, trends, and anomalies in your data.',
      color: '#4361ee'
    },
    {
      icon: '📊',
      title: 'Smart Visualizations',
      description: 'Automatically generate the perfect charts for your data type. No design skills required.',
      color: '#7209b7'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Upload, analyze, and visualize your data in minutes. Get results faster than ever before.',
      color: '#f72585'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your information with third parties.',
      color: '#4cc9f0'
    },
    {
      icon: '🔄',
      title: 'Multi-Format Support',
      description: 'Works seamlessly with CSV, Excel, JSON files. No data preparation needed.',
      color: '#f8961e'
    },
    {
      icon: '💼',
      title: 'Business Ready',
      description: 'From startups to enterprises, scale your data analysis without complexity.',
      color: '#2a9d8f'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Director',
      company: 'TechGrowth Inc',
      content: 'VizAssistant transformed how we analyze campaign data. What used to take days now takes minutes!',
      avatar: '👩‍💼'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Data Analyst',
      company: 'DataCorp',
      content: 'The AI insights are incredibly accurate. It caught patterns we had been missing for months.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Thompson',
      role: 'Research Lead',
      company: 'University Analytics',
      content: 'Perfect for academic research. Makes complex data visualization accessible to everyone.',
      avatar: '👩‍🎓'
    }
  ];

  const integrations = [
    { name: 'CSV Files', icon: '📄' },
    { name: 'Excel Spreadsheets', icon: '📊' },
    { name: 'JSON Data', icon: '🔤' },
    { name: 'Google Sheets', icon: '📋' }
  ];

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              <div className="logo-icon">📊</div>
              <span>VizAssistant</span>
            </Link>
            <div className="nav-actions">
              <Link to="/login" className="nav-login">
                Sign In
              </Link>
              <Link to="/login" className="nav-signup">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="badge-text">🎉 No Credit Card Required</span>
              </div>
              <h1>
                Data Analysis Made 
                <span className="gradient-text"> Simple & Powerful</span>
              </h1>
              <p className="hero-description">
                Transform raw data into stunning visualizations and actionable insights with AI. 
                Designed for everyone - from beginners to data experts. Start analyzing in minutes, not hours.
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn btn-primary btn-large">
                  🚀 Start Analyzing Free
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  📺 Watch Demo
                </Link>
              </div>
              <div className="hero-features">
                <div className="feature-item">
                  <span className="check-icon">✅</span>
                  <span>No setup required</span>
                </div>
                <div className="feature-item">
                  <span className="check-icon">✅</span>
                  <span>Free forever plan</span>
                </div>
                <div className="feature-item">
                  <span className="check-icon">✅</span>
                  <span>AI-powered insights</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="dashboard-showcase">
                <div className="showcase-header">
                  <div className="window-controls">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="showcase-tabs">
                    <span className="tab active">Sales Dashboard</span>
                    <span className="tab">Customer Insights</span>
                  </div>
                </div>
                <div className="showcase-content">
                  <div className="chart-grid">
                    <div className="chart-card">
                      <div className="chart-placeholder bar-chart"></div>
                      <div className="chart-label">Revenue Trend</div>
                    </div>
                    <div className="chart-card">
                      <div className="chart-placeholder pie-chart"></div>
                      <div className="chart-label">Market Share</div>
                    </div>
                    <div className="chart-card">
                      <div className="chart-placeholder line-chart"></div>
                      <div className="chart-label">Growth Metrics</div>
                    </div>
                    <div className="chart-card">
                      <div className="chart-placeholder metric-card">
                        <div className="metric-value">+24%</div>
                        <div className="metric-label">This Month</div>
                      </div>
                    </div>
                  </div>
                  <div className="ai-insights-preview">
                    <div className="insight-header">
                      <span className="ai-icon">🤖</span>
                      <span>AI Insights</span>
                    </div>
                    <div className="insight-list">
                      <div className="insight-item">
                        <span className="trend-up">📈</span>
                        <span>Sales increased by 24% this quarter</span>
                      </div>
                      <div className="insight-item">
                        <span className="trend-hot">🔥</span>
                        <span>Product A is trending in Q2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-content">
            <p className="trust-title">Trusted by data teams at</p>
            <div className="trust-logos">
              <div className="logo-item">Startups</div>
              <div className="logo-item">Enterprises</div>
              <div className="logo-item">Universities</div>
              <div className="logo-item">Agencies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need for Data Analysis</h2>
            <p>Powerful features that make data analysis accessible to everyone</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div 
                  className="feature-icon-wrapper"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <span 
                    className="feature-icon"
                    style={{ color: feature.color }}
                  >
                    {feature.icon}
                  </span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How VizAssistant Works</h2>
            <p>Get from data to insights in three simple steps</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-visual">
                <div className="step-number">1</div>
                <div className="step-icon">📁</div>
              </div>
              <div className="step-content">
                <h3>Upload Your Data</h3>
                <p>Drag and drop your CSV, Excel, or JSON files. No complex setup required.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-visual">
                <div className="step-number">2</div>
                <div className="step-icon">🤖</div>
              </div>
              <div className="step-content">
                <h3>Get AI Analysis</h3>
                <p>Our AI analyzes your data and provides instant insights and recommendations.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-visual">
                <div className="step-number">3</div>
                <div className="step-icon">📈</div>
              </div>
              <div className="step-content">
                <h3>Visualize & Share</h3>
                <p>Create beautiful charts and share insights with your team in one click.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="integrations-section">
        <div className="container">
          <div className="section-header">
            <h2>Works With Your Data</h2>
            <p>Seamlessly integrate with the tools you already use</p>
          </div>
          <div className="integrations-grid">
            {integrations.map((integration, index) => (
              <div key={index} className="integration-card">
                <div className="integration-icon">{integration.icon}</div>
                <span>{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Loved by Data Professionals</h2>
            <p>See what our users are saying about VizAssistant</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                    <div className="author-company">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Data?</h2>
            <p>Join thousands of professionals who use VizAssistant to make data-driven decisions</p>
            <div className="cta-actions">
              <Link to="/login" className="btn btn-primary btn-large">
                🚀 Start Your Free Trial
              </Link>
              <Link to="/login" className="btn btn-outline">
                📞 Book a Demo
              </Link>
            </div>
            <div className="cta-guarantee">
              <div className="guarantee-item">
                <span className="guarantee-icon">🔒</span>
                <span>No credit card required</span>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">⚡</span>
                <span>Setup in 2 minutes</span>
              </div>
              <div className="guarantee-item">
                <span className="guarantee-icon">💬</span>
                <span>Free support included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">📊</div>
                <span>VizAssistant</span>
              </div>
              <p>Making data analysis accessible and powerful for everyone.</p>
              <div className="footer-cta">
                <Link to="/login" className="btn btn-outline btn-small">
                  Start Analyzing Free
                </Link>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#integrations">Integrations</a>
                <a href="#pricing">Pricing</a>
                <a href="#demo">Demo</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#docs">Documentation</a>
                <a href="#tutorials">Tutorials</a>
                <a href="#blog">Blog</a>
                <a href="#support">Support</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#careers">Careers</a>
                <a href="#contact">Contact</a>
                <a href="#privacy">Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 VizAssistant. All rights reserved. Built with ❤️ for data enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;