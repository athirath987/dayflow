export default function StatCard({ label, value, subtext }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {subtext && <small>{subtext}</small>}
    </div>
  );
}
