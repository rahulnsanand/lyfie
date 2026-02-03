import './Dashboard.css';

interface BentoItem {
  id: number;
  title: string;
  size: string;
  content: string;
}

const BENTO_DATA: BentoItem[] = [
  { id: 1, title: "Main Feature", size: "span-2-2", content: "Big impact content here" },
  { id: 2, title: "Analytics", size: "", content: "Quick stats" },
  { id: 3, title: "Security", size: "", content: "Encrypted" },
  { id: 4, title: "Integrations", size: "span-col-2", content: "Connect your apps" },
];

export default function Dashboard() {
  return (
    <main className="dashboard-container">
      <section className="dashboard-intro">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here is what's happening today.</p>
      </section>

      <div className="bento-grid">
        {BENTO_DATA.map((item) => (
          <article key={item.id} className={`bento-item ${item.size}`}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </article>
        ))}
      </div>
    </main>
  );
}