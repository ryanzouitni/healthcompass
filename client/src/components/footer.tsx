import { useLanguage } from "@/lib/language-context";
import { Heart } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">{t("app.title")}</span>
          </div>
          
          <div className="max-w-md space-y-2 text-sm text-muted-foreground">
            <p>{t("footer.disclaimer")}</p>
            <p>{t("footer.privacy")}</p>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
