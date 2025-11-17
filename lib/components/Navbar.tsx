"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/tic-tac-toe", label: "Tic-Tac-Toe" },
  { href: "/art", label: "Art" },        // ← במקום /nasa
  { href: "/design", label: "Design" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {/* <div className={styles.logo}>Jam Web App</div> */}

      <ul className={styles.links}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive ? styles.activeLink : styles.link}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
