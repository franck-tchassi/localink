"use client"

import { useI18n } from "@/locales/client";
import React from "react";

const CallToAction = () => {
    const t = useI18n();
    return (
        <section className="py-8 bg-gradient-to-r mb-8 max-w-6xl m-auto from-blue-400 via-blue-500 to-blue-600 text-white text-center rounded-4xl">
            <div className="max-w-xl mx-auto px-2">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-4 ">
                    {t("landing.cta.title")}
                </h2>
                <p className="text-base mb-6 opacity-90">
                    {t("landing.cta.sub_title")}
                </p>
                <a
                    href="/auth/sign-in"
                    className="inline-block px-8 py-3 rounded-full bg-white text-blue-600 font-bold text-base shadow-lg hover:bg-blue-100 hover:text-blue-700 transition-all border-2 border-white"
                >
                    {t("landing.cta.signup")}
                </a>
            </div>
        </section>
    );
};

export default CallToAction;