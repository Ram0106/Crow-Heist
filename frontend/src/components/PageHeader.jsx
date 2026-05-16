export default function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="mb-6 border-b border-crow-line pb-5">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.35em] text-crow-gold">{eyebrow}</p> : null}
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h1 className="location-font text-4xl font-bold text-white sm:text-5xl">{title}</h1>
        {children}
      </div>
    </header>
  );
}
