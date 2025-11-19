
const GEMINI_API_KEY = 'AIzaSyD0N3EAnLPz56ht3cvg40fht3FrYhPvFp0'; // Replace with your actual API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const analyzeDataWithAI = async (data, columns) => {
  try {
    const prompt = `
      Analyze this dataset with columns: ${columns.join(', ')}.
      Provide:
      1. Key insights about the data
      2. Recommended chart types with explanations
      3. Notable patterns or anomalies
      4. Business recommendations
      
      Format the response as JSON with this structure:
      {
        "insights": ["array of insights"],
        "recommendedCharts": ["chart type names"],
        "patterns": ["pattern descriptions"],
        "recommendations": ["business recommendations"]
      }
      
      Sample data: ${JSON.stringify(data.slice(0, 5))}
    `;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('AI analysis failed');
    }

    const result = await response.json();
    const analysisText = result.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      insights: ["Data analyzed successfully"],
      recommendedCharts: ["bar", "line", "pie"],
      patterns: ["Patterns detected in the data"],
      recommendations: ["Consider further analysis"]
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return {
      insights: ["AI analysis temporarily unavailable"],
      recommendedCharts: ["bar", "line"],
      patterns: [],
      recommendations: []
    };
  }
};