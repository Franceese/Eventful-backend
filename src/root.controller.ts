import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class RootController {
  @Get()
  getRoot(@Res() res: Response) {
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Eventful API</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    body {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: white;
      text-align: center;
      padding: 20px;
    }

    .container {
      max-width: 700px;
      width: 100%;
    }

    h1 {
      font-size: clamp(28px, 6vw, 48px);
      margin-bottom: 15px;
    }

    p {
      font-size: clamp(14px, 3.5vw, 18px);
      color: #cbd5e1;
      margin-bottom: 25px;
      line-height: 1.6;
    }

    .btn {
      display: inline-block;
      padding: 12px 20px;
      background: #38bdf8;
      color: #0f172a;
      text-decoration: none;
      border-radius: 10px;
      font-weight: bold;
      transition: 0.3s ease;
    }

    .btn:hover {
      background: #0ea5e9;
      transform: scale(1.05);
    }

    .card {
      background: rgba(255,255,255,0.05);
      padding: 25px;
      border-radius: 16px;
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .footer {
      position: fixed;
      bottom: 10px;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 13px;
      color: #94a3b8;
      padding: 10px;
    }

    @media (max-width: 600px) {
      .card {
        padding: 18px;
      }

      .btn {
        width: 100%;
        display: block;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="card">
      <h1>Eventful API 🚀</h1>
      <p>
        A scalable event management backend for tickets, payments,
        reminders, and real-time event coordination.
        Built for production systems.
      </p>

      <a class="btn" href="/api">View API Documentation</a>
    </div>
  </div>

  <div class="footer">
    Built by Francees
  </div>
</body>
</html>
    `);
  }
}