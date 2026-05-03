export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`bc-card p-5 ${className}`}>{children}</div>;
}
