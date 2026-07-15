import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-[1600px] items-center px-4 py-16 md:px-8">
      <div className="max-w-xl">
        <p className="tag text-accent">Error 404</p>
        <h1 className="mt-3 text-4xl tracking-tight md:text-5xl">Página no encontrada</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-mute">
          La dirección no existe o la página fue movida.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent"
        >
          Volver al inicio <span aria-hidden>▸</span>
        </Link>
      </div>
    </div>
  );
}
