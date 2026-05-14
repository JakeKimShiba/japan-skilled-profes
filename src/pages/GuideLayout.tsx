import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Calculator } from "@phosphor-icons/react/dist/ssr/Calculator";
import { useI18n } from "@/i18n";

export function GuideLayout() {
  const { t } = useI18n();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        <nav className="flex items-center gap-4 mb-6 text-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Calculator size={16} />
            {t('tabs.calculator')}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">가이드</span>
        </nav>

        <Outlet />

        <Separator className="my-8" />

        <footer className="text-center text-sm text-muted-foreground space-y-2">
          <p>© {new Date().getFullYear()} {t('app.title')}</p>
          <div className="flex justify-center gap-4">
            <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
              {t('tabs.calculator')}
            </Link>
            <Link to="/guide" className="text-primary hover:text-primary/80 transition-colors">
              가이드
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
