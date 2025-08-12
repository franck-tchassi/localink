"use client"
// src/components/layout/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useI18n } from '@/locales/client';

const Footer = () => {
    const t = useI18n();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Logo et description */}
                    <div className="col-span-2">
                        <Link 
                            href="/" 
                            className="flex items-center"
                            aria-label={t('landing.footer.aria_label_home')}
                        >
                            <Image
                                src="/logo/localink.png"
                                alt="Logo Localink"
                                width={140}
                                height={140}
                                className="object-contain drop-shadow-md"
                                priority
                            />
                        </Link>
                        <p className="mt-4 text-sm text-gray-500">
                            {t('landing.footer.description')}
                        </p>
                        <div className="mt-6 flex space-x-6">
                            {['Youtube', 'LinkedIn', 'Instagram'].map((item) => (
                                <a 
                                    key={item} 
                                    href="#" 
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">{item}</span>
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                            {t('landing.footer.navigation.title')}
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/pricing" className="text-base text-gray-500 hover:text-gray-900">
                                    {t('landing.footer.navigation.prices')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/testimonials" className="text-base text-gray-500 hover:text-gray-900">
                                    {t('landing.footer.navigation.testimonials')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/features" className="text-base text-gray-500 hover:text-gray-900">
                                    {t('landing.footer.navigation.new_features')}
                                </Link>
                            </li>
                        </ul>
                    </div>


                    {/* Entreprise */}
                    {/* Entreprise */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                            {t('landing.footer.company.title')}
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                                    {t('landing.footer.company.about')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/partners/smes" className="text-base text-gray-500 hover:text-gray-900">
                                    {t('landing.footer.company.partners_smes')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/partners/brands" className="text-base text-gray-500 hover:text-gray-900">
                                    {t('landing.footer.company.partners_brands')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                

                {/* Bas de footer */}
                <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                            {t('landing.footer.legal.terms')}
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500 text-sm">
                            {t('landing.footer.legal.privacy')}
                        </a>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} Localink. {t('landing.footer.copyright')}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <select className="bg-transparent text-gray-500 text-sm border-0 focus:ring-0">
                            {['Français', 'English', 'Italiano', 'Español', 'Português'].map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;