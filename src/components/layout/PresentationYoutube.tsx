"use client"

import { useI18n } from "@/locales/client";
import React from "react";

const PresentationVideo = () => {
    const t = useI18n();
    return (
        <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-8">
                    {t("landing.presentationvideo.title")}
                </h2>
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border-8 border-blue-100 mx-auto">
                    <iframe
                        src="https://www.youtube.com/embed/rh9kenuTMBI"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                        title="Présentation Loom"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default PresentationVideo;