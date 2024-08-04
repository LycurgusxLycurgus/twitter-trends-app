import { NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';

export async function GET() {
  try {
    console.log('API: Fetching trends...');
    const twitterTrendsUrl = 'https://twitter-trends.iamrohit.in/united-states';
    const response = await axios.get(twitterTrendsUrl);
    console.log('API: Received response. Status:', response.status);
    const $ = cheerio.load(response.data);
    
    const trends: string[] = [];
    $('table.table-hover tr').slice(1, 11).each((i, elem) => {
      trends.push($(elem).find('td:nth-child(2)').text().trim());
    });
    console.log('API: Extracted trends:', trends);

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('API: Error fetching trends:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to fetch trends: ${errorMessage}` }, { status: 500 });
  }
}