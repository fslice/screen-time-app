// TEMP: bare minimum layout to diagnose Vercel 404
export const metadata = {
  title: "Test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
