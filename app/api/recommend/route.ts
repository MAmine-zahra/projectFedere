import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { previousResponses = [] } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const borrowedBooks = [
      "Le Petit Prince",
      "Les Misérables",
      "1984",
      "L'Étranger"
    ];

    const generationConfig = {
      temperature: 0.9, // Augmenté pour plus de variété
      topP: 0.95,
      maxOutputTokens: 150
    };

    const prompt = `
Tu es l'assistant de la bibliothèque TED University.
Commence ta réponse exactement par "Bonjour, je suis l'assistant de la bibliothèque TED University."

Voici les livres empruntés par l'utilisateur : ${borrowedBooks.join(", ")}.
Ces livres traitent de thèmes d'aliénation, de systèmes oppressifs et de réflexions existentielles.

Règles strictes :
1. Recommande 2-3 livres maximum
2. Ne suggère JAMAIS "La Peste", "Le Procès" ou "Fahrenheit 451"
3. Évite les auteurs déjà présents dans les livres empruntés (Saint-Exupéry, Hugo, Orwell, Camus)
4. Variété des genres : alterne entre classiques et contemporains
5. Ne répète aucun livre de ces suggestions précédentes : 
${previousResponses.join("\n\n")}

Structure de réponse :
- Phrase d'introduction thématique
- Liste de livres avec auteur et justification concise
- Conclusion encourageante
`;

    const response = await model.generateContent(prompt, generationConfig);
    let reponse = response.response.text().trim();

    // Nettoyage supplémentaire des suggestions répétées
    const bannedTitles = ["La Peste", "Le Procès", "Fahrenheit 451"];
    bannedTitles.forEach(title => {
      reponse = reponse.replace(new RegExp(title, "gi"), "");
    });

    return NextResponse.json({ reponse });
  } catch (e) {
    return NextResponse.json({
      reponse: "Bonjour, je suis l'assistant de la bibliothèque TED University. Je vous recommande des œuvres explorant la condition humaine et les défis sociétaux, comme 'Les Thanatonautes' de Bernard Werber ou 'La Horde du Contrevent' d'Alain Damasio."
    }, { status: 500 });
  }
}