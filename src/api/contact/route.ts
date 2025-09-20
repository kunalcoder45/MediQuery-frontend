import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: response.status });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}