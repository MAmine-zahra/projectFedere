import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ reponse: "❌ Veuillez écrire un genre de livre ou une question sur la bibliothèque TED University." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
Tu es l’assistant officiel de la Bibliothèque TED University (https://ted-university.com/).
Aide les étudiants et professeurs à trouver des livres, connaître les horaires, les services, ou à utiliser le site. 
Sois rapide, amical et professionnel. Si la question concerne les horaires, réponds sur les horaires de la bibliothèque TED University.
Question de l’utilisateur : ${message}
`;

    const response = await model.generateContent(prompt);
    const reponse = response.response.text().trim();

    return NextResponse.json({ reponse });
  } catch (e) {
    return NextResponse.json({ reponse: "Erreur lors de la génération de la réponse." }, { status: 500 });
  }
}