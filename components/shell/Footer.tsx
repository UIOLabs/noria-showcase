import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-4 py-8 md:h-20 md:flex-row md:gap-6 md:px-8 md:py-0">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" className="opacity-90" />
          <span className="tag">Creado para operadores</span>
        </div>
        <p className="text-[13px] text-mute">
          Todas las pantallas usan datos de demostración: sin backend ni registros reales.
        </p>
        <span className="tag">© Noria</span>
      </div>
    </footer>
  );
}
