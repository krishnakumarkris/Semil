export default function Navbar({ title }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-5 md:px-8">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
    </header>
  );
}
