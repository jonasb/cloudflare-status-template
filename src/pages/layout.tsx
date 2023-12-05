import { html } from "hono/html";

export function Layout({ title, children }: { title: string; children?: any }) {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          :root {
            --background: #fefcf6;
            --color: #1f2329;
          }
          body {
            background: var(--background);
            color: var(--color);
            font-family: sans-serif;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem 2rem;
          }
          .full-bleed-scroll-container {
            width: 100%;
            overflow-x: auto;
            margin: 0 -2rem;
            padding: 0 2rem;
          }
          .table {
            border-spacing: 0.25rem;
            font-variant-numeric: tabular-nums;
          }
          .table td,
          .table th {
            text-align: left;
            white-space: nowrap;
          }
          .table th h3 {
            margin: 0;
            margin-top: 0.5rem;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background: #02040a;
              --color: #e6edf3;
            }
          }
        </style>
      </head>
      <body>
        <main class="container">${children}</main>
      </body>
    </html>`;
}
