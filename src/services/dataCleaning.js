export const dataCleaningAPIs = {
  // OpenRefine API (Free open-source data cleaning)
  openRefine: {
    name: 'OpenRefine',
    description: 'Open-source tool for data cleaning and transformation',
    free: true,
    endpoints: {
      cleanText: 'http://localhost:3333/command/core/apply-operations', // Local instance
    }
  },

  // Datawrapper API (Free tier)
  datawrapper: {
    name: 'Datawrapper',
    description: 'Data visualization with built-in data cleaning',
    free: true,
    limits: '10,000 rows per month',
    endpoints: {
      upload: 'https://api.datawrapper.de/v3/charts',
      clean: 'https://api.datawrapper.de/v3/charts/{id}/data'
    }
  },

  // OpenAI ChatGPT API (Free tier for testing)
  openai: {
    name: 'OpenAI ChatGPT',
    description: 'AI-powered data cleaning suggestions',
    free: true,
    limits: 'Limited free requests',
    endpoints: {
      chat: 'https://api.openai.com/v1/chat/completions'
    }
  },

  // JSON2CSV / CSV2JSON Converters
  converters: {
    name: 'Online Converters',
    description: 'Free format conversion APIs',
    free: true,
    endpoints: {
      csvToJson: 'https://csv2json.com/api',
      jsonToCsv: 'https://json2csv.com/api'
    }
  }
};

// Main data cleaning service
export class DataCleaningService {
  static async cleanDataset(data, columns, cleaningOptions = {}) {
    const results = {
      originalCount: data.length,
      cleanedData: [],
      cleaningReport: {
        removedDuplicates: 0,
        filledMissingValues: 0,
        standardizedValues: 0,
        correctedDataTypes: 0,
        validationErrors: []
      }
    };

    try {
      // Step 1: Remove duplicates
      const uniqueData = this.removeDuplicates(data, columns);
      results.cleaningReport.removedDuplicates = data.length - uniqueData.length;

      // Step 2: Handle missing values
      const filledData = this.handleMissingValues(uniqueData, columns, cleaningOptions.missingValueStrategy);
      results.cleaningReport.filledMissingValues = this.countFilledMissing(uniqueData, filledData);

      // Step 3: Standardize values
      const standardizedData = this.standardizeValues(filledData, columns);
      results.cleaningReport.standardizedValues = this.countStandardized(filledData, standardizedData);

      // Step 4: Validate data types
      const validatedData = this.validateDataTypes(standardizedData, columns);
      results.cleaningReport.correctedDataTypes = this.countTypeCorrections(standardizedData, validatedData);

      // Step 5: Data quality scoring
      results.qualityScore = this.calculateQualityScore(results.cleaningReport, data.length);
      
      results.cleanedData = validatedData;
      results.finalCount = validatedData.length;

      return results;
    } catch (error) {
      console.error('Data cleaning error:', error);
      throw new Error(`Data cleaning failed: ${error.message}`);
    }
  }

  static removeDuplicates(data, keyColumns) {
    const seen = new Set();
    return data.filter(item => {
      const key = keyColumns.map(col => item[col]).join('|');
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  static handleMissingValues(data, columns, strategy = 'remove') {
    return data.filter(row => {
      const hasMissing = columns.some(col => 
        row[col] === null || row[col] === undefined || row[col] === '' || row[col] === 'NaN'
      );

      if (strategy === 'remove') {
        return !hasMissing;
      } else if (strategy === 'fill') {
        columns.forEach(col => {
          if (row[col] === null || row[col] === undefined || row[col] === '' || row[col] === 'NaN') {
            row[col] = this.inferFillValue(data, col);
          }
        });
        return true;
      }
      return true;
    });
  }

  static inferFillValue(data, column) {
    const sampleValues = data
      .map(row => row[column])
      .filter(val => val !== null && val !== undefined && val !== '' && val !== 'NaN')
      .slice(0, 10);

    if (sampleValues.length === 0) return 'Unknown';

    // Check if numeric
    const numericValues = sampleValues.filter(val => !isNaN(parseFloat(val)));
    if (numericValues.length > sampleValues.length / 2) {
      return '0'; // Default numeric value
    }

    // Check for common categorical values
    const valueCounts = {};
    sampleValues.forEach(val => {
      valueCounts[val] = (valueCounts[val] || 0) + 1;
    });

    const mostCommon = Object.keys(valueCounts).reduce((a, b) => 
      valueCounts[a] > valueCounts[b] ? a : b
    );

    return mostCommon;
  }

  static standardizeValues(data, columns) {
    return data.map(row => {
      const newRow = { ...row };
      columns.forEach(col => {
        if (newRow[col] !== null && newRow[col] !== undefined) {
          // Trim whitespace
          if (typeof newRow[col] === 'string') {
            newRow[col] = newRow[col].trim();
            
            // Standardize boolean-like values
            if (newRow[col].toLowerCase() === 'true' || newRow[col] === '1') newRow[col] = 'True';
            if (newRow[col].toLowerCase() === 'false' || newRow[col] === '0') newRow[col] = 'False';
            
            // Standardize null representations
            if (newRow[col].toLowerCase() === 'null' || newRow[col] === 'nan') newRow[col] = '';
          }
        }
      });
      return newRow;
    });
  }

  static validateDataTypes(data, columns) {
    return data.map(row => {
      const newRow = { ...row };
      columns.forEach(col => {
        const value = newRow[col];
        if (value !== null && value !== undefined && value !== '') {
          // Try to infer and convert types
          if (!isNaN(parseFloat(value)) && isFinite(value)) {
            newRow[col] = parseFloat(value);
          } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            newRow[col] = value.toLowerCase() === 'true';
          } else if (!isNaN(Date.parse(value))) {
            newRow[col] = new Date(value).toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }
        }
      });
      return newRow;
    });
  }

  static countFilledMissing(before, after) {
    // Simplified count - in real implementation, track actual fills
    return Math.max(0, after.length - before.length);
  }

  static countStandardized(before, after) {
    // Count differences between before and after standardization
    let count = 0;
    for (let i = 0; i < before.length; i++) {
      Object.keys(before[i]).forEach(key => {
        if (String(before[i][key]) !== String(after[i][key])) {
          count++;
        }
      });
    }
    return count;
  }

  static countTypeCorrections(before, after) {
    let count = 0;
    for (let i = 0; i < before.length; i++) {
      Object.keys(before[i]).forEach(key => {
        if (typeof before[i][key] !== typeof after[i][key]) {
          count++;
        }
      });
    }
    return count;
  }

  static calculateQualityScore(report, originalCount) {
    const weights = {
      duplicates: 0.3,
      missing: 0.4,
      standardization: 0.2,
      types: 0.1
    };

    const duplicateScore = 1 - (report.removedDuplicates / originalCount);
    const missingScore = report.filledMissingValues > 0 ? 0.7 : 1;
    const standardizationScore = 1 - (report.standardizedValues / (originalCount * Object.keys(report).length));
    const typeScore = 1 - (report.correctedDataTypes / (originalCount * Object.keys(report).length));

    return Math.round((
      duplicateScore * weights.duplicates +
      missingScore * weights.missing +
      standardizationScore * weights.standardization +
      typeScore * weights.types
    ) * 100);
  }

  // AI-powered data cleaning suggestions using free API
  static async getAICleaningSuggestions(data, columns) {
    try {
      // Using a free AI API (example with OpenAI-style response)
      const prompt = `
        Analyze this dataset with columns: ${columns.join(', ')}.
        Provide data cleaning recommendations in JSON format:
        {
          "issues": ["list of data quality issues"],
          "suggestions": ["specific cleaning actions"],
          "priority": "high/medium/low",
          "estimatedTime": "estimated cleaning time"
        }
        
        Sample data: ${JSON.stringify(data.slice(0, 5))}
      `;

      // For demo purposes, return mock AI suggestions
      // In production, you'd call an actual AI API
      return await this.getMockAISuggestions(data, columns);
    } catch (error) {
      console.error('AI suggestions error:', error);
      return this.getFallbackSuggestions(data, columns);
    }
  }

  static async getMockAISuggestions(data, columns) {
    // Mock AI response - replace with actual API call
    return {
      issues: [
        "Missing values detected in several columns",
        "Inconsistent date formats found",
        "Potential duplicate records identified",
        "Mixed data types in numeric columns"
      ],
      suggestions: [
        "Remove 5 duplicate records",
        "Standardize date format to YYYY-MM-DD",
        "Fill missing numeric values with column mean",
        "Convert text numbers to actual numeric type"
      ],
      priority: "medium",
      estimatedTime: "2-3 minutes",
      confidence: 85
    };
  }

  static getFallbackSuggestions(data, columns) {
    // Basic rule-based suggestions
    const issues = [];
    const suggestions = [];

    // Check for missing values
    const missingCounts = {};
    columns.forEach(col => {
      const missing = data.filter(row => 
        row[col] === null || row[col] === undefined || row[col] === ''
      ).length;
      if (missing > 0) {
        missingCounts[col] = missing;
      }
    });

    if (Object.keys(missingCounts).length > 0) {
      issues.push(`Missing values in ${Object.keys(missingCounts).length} columns`);
      suggestions.push(`Fill or remove ${Object.values(missingCounts).reduce((a, b) => a + b)} missing values`);
    }

    return {
      issues,
      suggestions,
      priority: issues.length > 0 ? "medium" : "low",
      estimatedTime: "1-2 minutes",
      confidence: 70
    };
  }
}

// Free external API integrations
export class ExternalDataCleaningAPIs {
  // CSV to JSON conversion using free API
  static async convertCSVtoJSON(csvText) {
    try {
      // Using a free conversion API
      const response = await fetch('https://api.csv2json.com/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: csvText
      });
      
      if (!response.ok) throw new Error('Conversion failed');
      return await response.json();
    } catch (error) {
      // Fallback to local parsing
      return await this.localCSVtoJSON(csvText);
    }
  }

  static async localCSVtoJSON(csvText) {
    return new Promise((resolve) => {
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const obj = {};
        const currentline = lines[i].split(',');

        headers.forEach((header, index) => {
          obj[header] = currentline[index] ? currentline[index].trim() : '';
        });

        result.push(obj);
      }

      resolve(result);
    });
  }

  // Data validation using free validation API
  static async validateEmailColumn(data, emailColumn) {
    // Mock email validation - in production, use a service like Abstract API
    const emails = data.map(row => row[emailColumn]).filter(email => email);
    
    const validationResults = emails.map(email => ({
      email,
      valid: this.isValidEmail(email),
      suggestion: this.isValidEmail(email) ? null : 'Check email format'
    }));

    return {
      validCount: validationResults.filter(r => r.valid).length,
      invalidCount: validationResults.filter(r => !r.valid).length,
      details: validationResults
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}