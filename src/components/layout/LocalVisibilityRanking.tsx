"use client";

import { motion } from "framer-motion";
import { Trophy, ArrowUp, BarChart2, Target, Search } from "lucide-react";
import { useEffect, useState } from "react";

const companies = [
    {
        name: "Bilo",
        visibility: 98,
        change: +3,
        sector: "Supermarché",
        icon: <Trophy className="w-5 h-5 text-yellow-500" />,
    },
    {
        name: "Claudia",
        visibility: 95,
        change: +1,
        sector: "Mode",
        icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
    },
    {
        name: "PocFly",
        visibility: 92,
        change: -2,
        sector: "Tech",
        icon: <Target className="w-5 h-5 text-red-500" />,
    },
    {
        name: "Savoie",
        visibility: 89,
        change: +5,
        sector: "Produits locaux",
        icon: <ArrowUp className="w-5 h-5 text-green-500" />,
    },
    {
        name: "OptiVision",
        visibility: 87,
        change: 0,
        sector: "Optique",
        icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
    },
];

const LocalVisibilityRanking = () => {
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState(companies);
    const [animatedList, setAnimatedList] = useState(companies);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (search.trim() === "") {
            setFiltered(animatedList);
        } else {
            setFiltered(
                animatedList.filter(
                    (c) =>
                        c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.sector.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, animatedList]);

    // Animation automatique du classement
    useEffect(() => {
        if (search.trim() !== "") return; // Pas d'animation si recherche
        const interval = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setAnimatedList((prev) => {
                    const newList = [...prev];
                    const first = newList.shift();
                    if (first) newList.push(first);
                    return newList;
                });
                setAnimating(false);
            }, 200); // animation plus rapide
        }, 1200); // cycle plus rapide
        return () => clearInterval(interval);
    }, [search]);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 w-full max-w-md mx-auto mt-8">
            {/* Barre de recherche façon Google */}
            <div className="p-4 bg-gradient-to-r from-blue-400 to-blue-500">
                <form
                    className="flex items-center gap-2"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher une entreprise, un secteur..."
                            className="w-full px-5 py-3 rounded-full border-none shadow focus:outline-none text-gray-900 text-base bg-white"
                            style={{
                                boxShadow: "0 2px 8px rgba(255,140,0,0.08)",
                            }}
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                    </div>
                </form>
            </div>
            {/* Classement */}
            <div className="p-4 relative">
                {filtered.length === 0 ? (
                    <div className="text-center text-blue-400 py-8">
                        Aucun résultat
                    </div>
                ) : (
                    filtered.map((company, index) => (
                        <motion.div
                            key={company.name}
                            initial={{ opacity: 0, y: animating && index === filtered.length - 1 ? 40 : 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4, delay: 0.05 * index }}
                            className={`flex items-center justify-between p-3 rounded-lg mb-2 ${index === 0
                                ? "bg-blue-50 border border-blue-200"
                                : "hover:bg-blue-50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-blue-500 bg-blue-100 border border-blue-300`}
                                >
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-600">
                                        {company.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {company.sector}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="font-bold text-blue-500">
                                        {company.visibility}%
                                    </span>
                                    <div
                                        className={`text-xs flex items-center justify-end ${company.change > 0
                                            ? "text-green-500"
                                            : company.change < 0
                                                ? "text-red-500"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {company.change > 0 ? "+" : ""}
                                        {company.change !== 0
                                            ? company.change
                                            : "="}
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
                                    {company.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LocalVisibilityRanking;