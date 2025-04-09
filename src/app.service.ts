import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Food Delivery API</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #f3f4f6;
          }
          .container {
            text-align: center;
            padding: 2rem;
            border-radius: 12px;
            background: white;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #111827;
          }
          p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            color: #374151;
          }
          a {
            background-color: #2563eb;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: background 0.3s ease;
          }
          a:hover {
            background-color: #1e40af;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Welcome to the Food Delivery Backend API</h1>
          <p>Click below to explore the API documentation</p>
          <a href="/api-docs">Go to Swagger Docs</a>
        </div>
      </body>
      </html>
    `;
  }
}
