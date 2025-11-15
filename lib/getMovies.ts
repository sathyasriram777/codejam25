import { ChatPerplexity } from "@langchain/community/chat_models/perplexity";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export const userInputSchema = z.object({
  preferredGenres: z.array(z.string()).min(1, "At least one genre is required").describe("An array of preferred music genres"),
  songs: z.array(z.object({
    name: z.string().min(1, "Song name is required"),
    artist: z.string().min(1, "Artist name is required"),
    genre: z.string().min(1, "Genre is required"),
  })).optional().describe("An optional array of songs with name, artist, and genre"),
});

const movieRecommendationsSchema = z.object({
  movies: z.array(z.object({
    title: z.string().min(1, "Movie title is required"),
    genre: z.array(z.string()).min(1, "At least one genre is required").describe("An array of movie genres"),
    expectedScore: z.number().min(0).max(1).describe("The probability (0-1) that the user will like this movie based on their preferences"),
  })).min(1, "At least one movie is required").describe("An array of recommended movies with title, genre, and expectedScore"),
});

const parser = StructuredOutputParser.fromZodSchema(movieRecommendationsSchema);

const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert at creating movie recommendations based on a user's preferences.

User's preferred genres: {genres}
{songsSection}

Based on these preferences, recommend movies that match the user's taste in music and genres.

For each movie, provide:
1. The movie title
2. The movie's genres (as an array of genre strings)
3. An expectedScore (a number between 0 and 1) representing the probability that the user will like this movie based on their preferences.
   - Higher scores (0.6-1.0) mean you're confident the user will like it (popular, well-matched)
   - Lower scores (0.0-0.4) mean you're less certain or it's a hidden gem that might surprise them

{format_instructions}

IMPORTANT: Return the movies with their title, genre, and expectedScore in the specified format, no other text.
`);

export async function generateMovieRecommendations(userInput: z.infer<typeof userInputSchema>) {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error("PERPLEXITY_API_KEY is not set in environment variables");
  }

  const model = new ChatPerplexity({
    apiKey: process.env.PERPLEXITY_API_KEY,
    model: "sonar",
  });

  const validatedInput = userInputSchema.parse(userInput);

  const formatInstructions = parser.getFormatInstructions();

  const songsSection = validatedInput.songs && validatedInput.songs.length > 0
    ? `User's favorite songs:\n${validatedInput.songs
        .map(song => `- "${song.name}" by ${song.artist} (${song.genre})`)
        .join('\n')}`
    : '';

  const prompt = await promptTemplate.format({
    genres: validatedInput.preferredGenres.join(', '),
    songsSection,
    format_instructions: formatInstructions,
  });

  try {
    const response = await model.invoke(prompt);
    const parsedOutput = await parser.parse(response.content.toString());
    
    return parsedOutput.movies;
  } catch (error) {
    console.error("Error generating movie recommendations:", error);
    throw new Error("Failed to generate movie recommendations");
  }
}

export async function getMovies(userInput: z.infer<typeof userInputSchema>) {
  const movies = await generateMovieRecommendations(userInput);
  return movies;
}

(async () => {
  try {
    const movies = await getMovies({
      preferredGenres: ["drama", "romance", "pumpkin spice"],
      songs: [
        { name: "Why am I like this?", artist: "Orla Gartland", genre: "indie" },
        { name: "Sweet Tooth", artist: "Cavetown", genre: "rock" },
        { name: "Is This What Love Is?", artist: "Wasia Project", genre: "indie-jazz" },
      ],
    });
    console.log("Recommended movies:", movies);
  } catch (error) {
    console.error("Error:", error);
  }
})();

// (async () => {
//   const movies = await getMovies({
//     preferredGenres: ["sci-fi", "space"]
//   });
//   console.log("Recommended movies:", movies);
// })();