import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ← on ajoute l'id ici
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
