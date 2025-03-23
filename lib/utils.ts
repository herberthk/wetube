export const parseLLMInsightsResponse =(response?: string): InsightsArray =>{
    if (!response) {
      return [];
    }
    const sections = response.split(/\n-\s/).filter(Boolean);
  
    const insightsArray: InsightsArray = sections.map((section) => {
      const [titleLine, ...rest] = section.split('\n').filter(Boolean);
  
      const title = titleLine.replace(":", "").trim();
      const items = rest
        .map((line) => line.trim().replace(/^(\*|-)\s*/, ""))
        .filter(Boolean);
  
      if (title.toLowerCase().includes("sentiment score") && items.length === 0) {
        const scoreMatch = titleLine.match(/(\d+)/);
        if (scoreMatch) {
          return { title: "Sentiment Score", items: [scoreMatch[1]] };
        }
      }
  
      return { title, items };
    });
  
    return insightsArray;
  }