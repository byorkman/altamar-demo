import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 text-4xl">Esta página se la llevó la marea</h1>
      <Link href="/" className="btn-primary mt-8">
        Volver al inicio
      </Link>
    </div>
  );
}
