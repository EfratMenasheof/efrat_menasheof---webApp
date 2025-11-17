"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type ArtItem = any;

type ArtDataResult = {
  departmentTitle: string;
  items: ArtItem[];
};

/**
 * מחזירה אובייקט עם שם המחלקה ומערך של יצירות אמנות ממחלקה מסוימת
 * departmentId – מזהה מחלקה (כמו 11)
 * count – כמה פריטים להחזיר
 */
async function getArtData(
  departmentId: string,
  count: number
): Promise<ArtDataResult> {
  const BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

  // 1. להביא את רשימת המחלקות כדי לשלוף את שם המחלקה
  const depRes = await fetch(`${BASE}/departments`);
  if (!depRes.ok) {
    throw new Error("Failed to load departments from The Met API");
  }
  const depJson = await depRes.json();
  const departments = depJson.departments || [];
  const department = departments.find(
    (d: any) => String(d.departmentId) === String(departmentId)
  );
  const departmentTitle =
    department?.displayName || `Department #${departmentId}`;

  // 2. להביא רשימת objectIDs של המחלקה הזו
  const objectsRes = await fetch(
    `${BASE}/objects?departmentIds=${departmentId}`
  );
  if (!objectsRes.ok) {
    throw new Error("Failed to load objects list for this department");
  }
  const objectsJson = await objectsRes.json();
  const allIds: number[] = objectsJson.objectIDs || [];

  if (allIds.length === 0) {
    return { departmentTitle, items: [] };
  }

  // 3. לערבב את המערך ולבחור count מזהים אקראיים
  const shuffled = [...allIds].sort(() => Math.random() - 0.5);
  const selectedIds = shuffled.slice(0, count);

  // 4. להביא את הנתונים המלאים לכל יצירה
  const itemPromises = selectedIds.map(async (id) => {
    const res = await fetch(`${BASE}/objects/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to load object ${id}`);
    }
    return res.json();
  });

  const allItems = await Promise.all(itemPromises);

  // 5. לסנן רק פריטים שיש להם תמונה
  const itemsWithImage = allItems.filter(
    (item: any) => item.primaryImageSmall || item.primaryImage
  );

  return {
    departmentTitle,
    items: itemsWithImage,
  };
}

export default function ArtPage() {
  const [departmentTitle, setDepartmentTitle] = useState<string>("");
  const [items, setItems] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // אפשר לבחור מחלקה אחרת – 11 היא לרוב European Paintings
    const DEPARTMENT_ID = "11";
    const COUNT = 8;

    setLoading(true);
    setError(null);

    getArtData(DEPARTMENT_ID, COUNT)
      .then((result) => {
        setDepartmentTitle(result.departmentTitle);
        setItems(result.items);
      })
      .catch((err: any) => {
        console.error(err);
        setError(
          "Sorry, we had trouble loading art from The Met. Please try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className={styles.container} dir="ltr">
        <h1>Art from The Met</h1>
        <p>Loading amazing art… 🎨</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container} dir="ltr">
        <h1>Art from The Met</h1>
        <p className={styles.error}>{error}</p>
      </main>
    );
  }

  return (
    <main className={styles.container}dir="ltr">
      <h1>Art from The Met</h1>
      {departmentTitle && (
        <p className={styles.department}>Department: {departmentTitle}</p>
      )}

      <section className={styles.grid}>
        {items.map((item: any) => (
          <article key={item.objectID} className={styles.card}>
            <div className={styles.imageWrapper}>
              {item.primaryImageSmall || item.primaryImage ? (
                <img
                  src={item.primaryImageSmall || item.primaryImage}
                  alt={item.title}
                />
              ) : (
                <div className={styles.noImage}>No image available</div>
              )}
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.title}>{item.title}</h2>
              <p className={styles.artist}>
                {item.artistDisplayName || "Unknown artist"}
              </p>

              {/* לפחות עוד 3 שדות מה-API */}
              <ul className={styles.detailsList}>
                <li>
                  <strong>Date:</strong>{" "}
                  {item.objectDate || "Unknown date"}
                </li>
                <li>
                  <strong>Medium:</strong>{" "}
                  {item.medium || "Unknown medium"}
                </li>
                <li>
                  <strong>Culture:</strong>{" "}
                  {item.culture || "Unknown culture"}
                </li>
              </ul>

              {item.objectURL && (
                <a
                  href={item.objectURL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.moreLink}
                >
                  View on The Met website ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
