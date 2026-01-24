
import { GoogleGenAI } from "@google/genai";
import { Player, MatchInfo } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateGameReport = async (players: Player[], matchInfo: MatchInfo): Promise<string> => {
  const client = getGeminiClient();
  if (!client) return "Clé API manquante. Impossible de générer le rapport.";

  const activePlayers = players.filter(p => 
    p.stats.points > 0 || p.stats.rebounds > 0 || p.stats.assists > 0 || p.stats.minutesPlayed > 0
  );

  if (activePlayers.length === 0) {
    return "Aucune donnée statistique suffisante pour générer un rapport.";
  }

  const statsSummary = activePlayers.map(p => ({
    name: p.name,
    number: p.number,
    stats: p.stats
  }));

  const prompt = `
    Agis comme un coach de basketball professionnel et charismatique.
    Voici les détails du match :
    - Équipe : ${matchInfo.teamName || 'Mon Équipe'}
    - Adversaire : ${matchInfo.opponent || 'Adversaire'}
    - Lieu : ${matchInfo.location || 'Lieu inconnu'}
    - Date : ${matchInfo.date} à ${matchInfo.time}
    - Compétition : ${matchInfo.championship || 'Match amical'}
    
    Statistiques des joueurs :
    ${JSON.stringify(statsSummary, null, 2)}

    Génère un résumé de match de haut niveau (en français).
    1. Un titre percutant citant explicitement les deux équipes, la date et le lieu (ex: Rapport : [Team] vs [Adversaire] - [Date] @ [Lieu]).
    2. Analyse du MVP du match avec une justification technique précise basée sur les chiffres.
    3. Analyse tactique globale (points forts, axes de progression).
    4. Un message de motivation inspirant pour la suite.
    
    Utilise des emojis de basketball 🏀🔥. Formatte la réponse en Markdown élégant.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Désolé, je n'ai pas pu générer l'analyse.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Erreur lors de la connexion à l'assistant coach.";
  }
};
