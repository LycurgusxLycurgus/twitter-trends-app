import { NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';

export async function GET() {
  try {
    const twitterTrendsUrl = 'https://twitter-trends.iamrohit.in/united-states';
    const response = await axios.get(twitterTrendsUrl);
    const $ = cheerio.load(response.data);
    
    const trends: string[] = [];
    $('table.table-hover tr').slice(1, 11).each((i, elem) => {
      trends.push($(elem).find('td:nth-child(2)').text().trim());
    });

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}