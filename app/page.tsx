import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "40px" }}>
      <div dir="ltr">
        <h1>Shalom</h1>
        <p>You may choose a link from the list below, or use the Navbar on top</p>

        <ul style={{ marginTop: "16px", fontSize: "18px", lineHeight: "2" }}>
          <li>
            <Link href="/tic-tac-toe">Tic-Tac-Toe</Link>
          </li>
          <li>
            <Link href="/art">MET ART 🖼️</Link>
          </li>
          <li>
            <Link href="/design">Designer - Recipy🍴</Link>
          </li>
        </ul>

        <p style={{ marginTop: "30px", color: "#666" }}>
          Have fun!
        </p>
      </div>
    </main>
  );
}
