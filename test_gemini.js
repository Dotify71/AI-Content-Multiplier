const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: 'video/*',
          fileUri: 'https://www.youtube.com/watch?v=tB88DEBk5tw',
        },
      },
      { text: "What is this video about?" },
    ]);
    
    console.log(result.response.text());
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}
test();
