"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/locales/client";
import Image from "next/image";
import Link from "next/link";

const companyLogos = [
  "/entreprise/bilo.png",
  "/entreprise/claudia.png",
  "/entreprise/pocfly.png",
  "/entreprise/savoie.png"
];

const Hero = () => {

    const t = useI18n();
    return (
        <section className="relative flex items-center min-h-[70vh] bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
                    
                    {/* Titre principal percutant */}
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                            {t("landing.hero.title")}
                        </span><br />
                        {t("landing.hero.sub_title")}
                    </h1>

                    {/* Sous-titre explicatif */}
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                        {t("landing.hero.description_1")} 
                        <span className="font-semibold text-blue-600"> {t("landing.hero.description_2_blue")} </span> 
                        {t("landing.hero.description_3")}.
                    </p>

                    {/* CTA avec statistiques impressionnantes */}
                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
                        <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg">
                            <Link href="/auth/sign-in">
                                {t("landing.hero.demarrer")}  →
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="flex items-center">
                        <div className="flex -space-x-2">
                            {companyLogos.slice(0, 4).map((src, index) => (
                            <div
                                key={index}
                                className="relative h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-blue-500 bg-white shadow-sm overflow-hidden transition-transform hover:scale-110 hover:z-10"
                            >
                                <Image
                                src={src}
                                alt={`Logo partenaire ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 40px, 48px"
                                className="object-contain p-1"
                                quality={80}
                                />
                            </div>
                            ))}
                        </div>
                        {companyLogos.length > 4 && (
                            <span className="ml-3 text-sm font-medium text-gray-600">
                            +{companyLogos.length - 4} autres
                            </span>
                        )}
                        </div> 
                        <span>{t("landing.hero.confiance")} </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Hero;