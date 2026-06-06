import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class RootController {
  @Get()
  getRoot(@Res() res: Response) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Eventful API</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            color: white;
            display: flex;
            height: 100vh;
            justify-content: center;
            align-items: center;
            text-align: center;
          }

          .container {
            max-width: 600px;
            padding: 40px;
          }

          h1 {
            font-size: 42px;
            margin-bottom: 10px;
          }

          p {
            font-size: 18px;
            color: #cbd5e1;
            margin-bottom: 25px;
          }

          a {
            display: inline-block;
            padding: 12px 20px;
            background: #38bdf8;
            color: black;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
          }

          a:hover {
            background: #0ea5e9;
          }

          .footer {
            position: fixed;
            bottom: 15px;
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: #94a3b8;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <h1>Eventful API 🚀</h1>
          <p>
            A powerful event management backend built for scalability, payments,
            tickets, and real-time reminders.
          </p>

          <a href="/api">View API Documentation</a>
        </div>

        <div class="footer">
          Built by Francees
        </div>
      </body>
      </html>
    `);
  }
}