import './globals.css';

export const metadata = {
  title: 'EdgeLink SEO Automation Dashboard',
  description: 'AI-driven automated website SEO audit platform with BullMQ pipeline and dual portal'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
