"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Route, Layers, Eye, Users, BarChart } from "lucide-react";
import LocaleSelectLanguage from "@/app/[locale]/LocaleSelectLanguage";
import Image from "next/image";
import Features from "./Features";
import { useI18n } from "@/locales/client";
import { cn } from "@/lib/utils";

const navLinks = [
    {
        name: "Fonctionnalités",
        href: "/fonctionnality",
        items: [
            { 
                title: "Génération KML", 
                href: "/kml", 
                description: "Créez des fichiers KML optimisés pour Google My Maps",
                icon: <Layers className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Visibilité en ligne", 
                href: "/visibilite", 
                description: "Analysez et améliorez votre présence cartographique",
                icon: <Eye className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Positions & Routes", 
                href: "/positions", 
                description: "Gérez vos points géographiques et itinéraires",
                icon: <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Gestion Clients", 
                href: "/clients", 
                description: "Suivi complet de votre portefeuille clients",
                icon: <Users className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Analytics", 
                href: "#analytics", 
                description: "Statistiques détaillées sur votre visibilité",
                icon: <BarChart className="w-5 h-5 mr-2 text-blue-500" />
            },
            { 
                title: "Polylignes", 
                href: "/polylignes", 
                description: "Créez des tracés complexes pour une couverture réaliste",
                icon: <Route className="w-5 h-5 mr-2 text-blue-500" />
            }
        ]
    },
    {
        name: "Tarifs",
        href: "/pricing",
    },
];

const Header = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const t = useI18n();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Empêche le défilement du body quand le menu est ouvert
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <header className={cn(
            "w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300",
            scrolled ? "shadow-sm" : "shadow-none"
        )}>
            <div className="container mx-auto flex items-center justify-between py-2 px-4 md:px-6 lg:px-8">
                <Link 
                    href="/" 
                    className="flex items-center"
                    aria-label="Localink - Retour à l'accueil"
                >
                    <Image
                        src="/logo/localink.png"
                        alt="Logo Localink"
                        width={140}
                        height={40}
                        className="object-contain h-10 w-auto drop-shadow-md"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <Features />
                    <Link 
                        href="/pricing"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t("landing.header.features.price")}
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                    <div className="relative">
                        <LocaleSelectLanguage />
                    </div>
                    <Link href="/auth/sign-in">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-blue-500 cursor-pointer text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium px-4 py-1.5 rounded-lg"
                        >
                            {t("landing.header.signin")}
                        </Button>
                    </Link>
                    <Link href="/auth/sign-in">
                        <Button 
                            size="sm" 
                            className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white font-medium px-4 py-1.5 rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                            {t("landing.header.cta")}
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-blue-50 focus:outline-none transition-colors"
                    onClick={() => setOpen(!open)}
                    aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {open ? <X className="size-6 text-blue-500" /> : <Menu className="size-6 text-blue-500" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {open && (
                <div className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-lg z-40 mt-16 overflow-y-auto">
                    <div className="container px-4 py-4">
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <div key={link.name} className="border-b border-gray-100 last:border-0">
                                    <Link
                                        href={link.href}
                                        className="flex items-center justify-between text-base font-medium text-gray-900 hover:text-blue-600 transition-colors py-3 px-2 rounded-lg"
                                        onClick={() => setOpen(false)}
                                    >
                                        {link.name}
                                        {link.items && <span className="text-gray-400">+</span>}
                                    </Link>
                                    {link.items && (
                                        <div className="ml-2 mb-2 flex flex-col gap-1">
                                            {link.items.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-start text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <div className="flex items-center">
                                                        {item.icon}
                                                        <div>
                                                            <div className="font-medium">{item.title}</div>
                                                            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                        
                        <div className="mt-6 flex flex-col gap-3">
                            <div className="px-2">
                                <LocaleSelectLanguage mobile />
                            </div>
                            <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                                <Button 
                                    variant="outline" 
                                    className="w-full cursor-pointer border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg py-3"
                                >
                                    Se connecter
                                </Button>
                            </Link>
                            <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                                <Button 
                                    className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg py-3 hover:from-blue-600 hover:to-blue-700 shadow-sm"
                                >
                                    Essai gratuit
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;