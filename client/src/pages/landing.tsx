import { Link } from "wouter";
import { 
  ArrowRight, 
  ClipboardList, 
  LineChart, 
  Activity,
  Shield,
  CheckCircle2,
  Heart,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

export default function Landing() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container relative z-10 px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              <span>{t("hero.disclaimer")}</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/assessment">
                <Button size="lg" className="gap-2 px-8 py-6 text-lg" data-testid="button-start-assessment">
                  {t("hero.cta")}
                  <ArrowRight className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                {t("hero.time")}
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            {t("how.title")}
          </h2>
          
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <Card className="relative overflow-hidden border-2 hover-elevate">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardList className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute -top-2 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("how.step1.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("how.step1.desc")}</p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-2 hover-elevate">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <LineChart className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute -top-2 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("how.step2.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("how.step2.desc")}</p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-2 hover-elevate">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute -top-2 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("how.step3.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("how.step3.desc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            {t("why.title")}
          </h2>
          
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-risk-high/10">
                  <Users className="h-8 w-8 text-risk-high" />
                </div>
                <p className="mb-2 text-4xl font-bold text-risk-high">{t("why.stat1.number")}</p>
                <p className="text-sm text-muted-foreground">{t("why.stat1.label")}</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-risk-moderate/10">
                  <Heart className="h-8 w-8 text-risk-moderate" />
                </div>
                <p className="mb-2 text-4xl font-bold text-risk-moderate">{t("why.stat2.number")}</p>
                <p className="text-sm text-muted-foreground">{t("why.stat2.label")}</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-risk-low/10">
                  <CheckCircle2 className="h-8 w-8 text-risk-low" />
                </div>
                <p className="mb-2 text-4xl font-bold text-risk-low">{t("why.stat3.number")}</p>
                <p className="text-sm text-muted-foreground">{t("why.stat3.label")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("trust.title")}
            </h2>
            <p className="mb-12 text-muted-foreground">
              {t("trust.desc")}
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Card className="hover-elevate">
                <CardContent className="flex flex-col items-center p-4">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                    <span className="text-xl font-bold text-blue-500">WHO</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{t("trust.who")}</p>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardContent className="flex flex-col items-center p-4">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <span className="text-xl font-bold text-red-500">MS</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{t("trust.morocco")}</p>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardContent className="flex flex-col items-center p-4">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
                    <span className="text-xl font-bold text-indigo-500">CDC</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{t("trust.cdc")}</p>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardContent className="flex flex-col items-center p-4">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10">
                    <span className="text-xl font-bold text-teal-500">ADA</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{t("trust.ada")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("hero.title")}
            </h2>
            <p className="mb-8 text-muted-foreground">
              {t("hero.subtitle")}
            </p>
            <Link href="/assessment">
              <Button size="lg" className="gap-2 px-8" data-testid="button-start-assessment-bottom">
                {t("hero.cta")}
                <ArrowRight className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
