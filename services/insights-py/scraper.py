import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from collections import Counter
import uvicorn
import re

app = FastAPI(title="Smartistics Scraper Service", version="0.1.0")

# CORS setup - let Next.js talk to this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SME-focused search terms for African markets
SEARCH_TERMS = [
    "African SME marketing trends",
    "digital marketing Africa small business", 
    "mobile money payments Africa",
    "e-commerce Africa SME",
    "social media marketing Africa"
]

def clean_text(text):
    """Clean up scraped text"""
    # Remove extra whitespace and special chars
    return re.sub(r'\s+', ' ', text).strip()

@app.get("/")
def root():
    return {"message": "Smartistics Scraper Service is running"}

@app.get("/scrape/trends")
def scrape_trends():
    """Scrape marketing trends for African SMEs"""
    trend_results = []
    
    try:
        for term in SEARCH_TERMS:
            print(f"Scraping for: {term}")
            
            # Google News search
            search_url = f"https://news.google.com/search?q={term.replace(' ', '+')}&hl=en-US&gl=US&ceid=US:en"
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            
            response = requests.get(search_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Try multiple selectors for headlines
            selectors = ["a.DY5T1d", "article h3 a", "a[href*='/articles/']", "h3 a"]
            headlines = []
            
            for selector in selectors:
                elements = soup.select(selector)
                if elements:
                    headlines = [clean_text(el.get_text()) for el in elements[:8]]
                    break
            
            if headlines:
                trend_results.extend(headlines)
                print(f"Found {len(headlines)} headlines for '{term}'")
            else:
                print(f"No headlines found for '{term}'")
        
        if not trend_results:
            # Fallback with dummy data if scraping fails
            print("No data scraped, using fallback data")
            return {
                "trends": [
                    {"date": datetime.utcnow().strftime("%Y-%m-%d"), "keyword": "marketing", "mentions": 12},
                    {"date": datetime.utcnow().strftime("%Y-%m-%d"), "keyword": "digital", "mentions": 8},
                    {"date": datetime.utcnow().strftime("%Y-%m-%d"), "keyword": "africa", "mentions": 6},
                    {"date": datetime.utcnow().strftime("%Y-%m-%d"), "keyword": "business", "mentions": 10},
                    {"date": datetime.utcnow().strftime("%Y-%m-%d"), "keyword": "mobile", "mentions": 5}
                ],
                "status": "fallback_data"
            }
        
        # Process the scraped headlines
        all_words = []
        for headline in trend_results:
            # Split into words, clean them up
            words = re.findall(r'\b[a-zA-Z]{3,}\b', headline.lower())
            all_words.extend(words)
        
        # Filter out common stop words
        stop_words = {'the', 'and', 'for', 'are', 'with', 'they', 'this', 'that', 'from', 'you', 'was', 'can', 'has', 'have', 'will'}
        filtered_words = [word for word in all_words if word not in stop_words]
        
        # Get most common keywords
        common_keywords = Counter(filtered_words).most_common(8)
        
        today = datetime.utcnow().strftime("%Y-%m-%d")
        trends = [
            {"date": today, "keyword": keyword, "mentions": count} 
            for keyword, count in common_keywords if count > 1
        ]
        
        print(f"Processed {len(trend_results)} headlines into {len(trends)} trend points")
        
        return {
            "trends": trends,
            "status": "success",
            "headlines_processed": len(trend_results)
        }
        
    except requests.RequestException as e:
        print(f"Request error: {str(e)}")
        return {"error": f"Network error: {str(e)}", "trends": []}
    except Exception as e:
        print(f"General error: {str(e)}")
        return {"error": f"Scraping error: {str(e)}", "trends": []}

if __name__ == "__main__":
    print("Starting Smartistics Scraper on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)