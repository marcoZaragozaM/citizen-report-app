export default function Layout({ title, children }: any) {
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: "40px auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
}