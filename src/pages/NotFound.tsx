import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-[55vh] items-center justify-center bg-background px-5">
    <div className="text-center">
      <span className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">La Voz de Jesús</span>
      <h1 className="mb-3 mt-3 font-display text-5xl font-bold text-foreground">404</h1>
      <p className="mb-5 text-lg text-muted-foreground">No encontramos esta página.</p>
      <Link to="/" className="text-sm font-bold text-primary underline underline-offset-4 hover:text-primary/90">
        Volver al inicio
      </Link>
    </div>
  </div>
);

export default NotFound;
