import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Call your Python scraper service
    const response = await fetch('http://localhost:8001/scrape/trends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Python service responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Return the data from Python service
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error calling Python scraper:', error);
    
    // Return fallback data if Python service is down
    return NextResponse.json({
      error: 'Scraper service unavailable',
      trends: [
        {"date": new Date().toISOString().split('T')[0], "keyword": "marketing", "mentions": 15},
        {"date": new Date().toISOString().split('T')[0], "keyword": "digital", "mentions": 12},
        {"date": new Date().toISOString().split('T')[0], "keyword": "africa", "mentions": 8},
        {"date": new Date().toISOString().split('T')[0], "keyword": "business", "mentions": 10},
        {"date": new Date().toISOString().split('T')[0], "keyword": "sme", "mentions": 6}
      ],
      status: 'fallback'
    }, { status: 200 });
  }
}