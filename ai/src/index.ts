import { Request, Response, route } from "./httpSupport";
import fetch from "node-fetch";

async function fetchArticle(url: string): Promise<string> {
	const response = await fetch(url);
	const contentType = response.headers.get("content-type");


	return await response.text();

	
}

async function processWithRedPillAI(
	prompt: string,
	apiKey: string,
	model: string = "gpt-4o",
): Promise<string> {
	const response = await fetch("https://api.red-pill.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			messages: [{ role: "user", content: prompt }],
			model: model,
		}),
	});

	const responseData = await response.json();
	if (responseData.error) {
		throw new Error(responseData.error);
	}
	return responseData.choices[0].message.content;
}

async function extractInformation(text: string, apiKey: string): Promise<any> {
	const prompt = `Extract key information from the following content. Provide a JSON object with relevant fields such as title, author, date, main points, and any other important details. If the content is not an article, describe what it contains:\n\n${text}`;
	const result = await processWithRedPillAI(prompt, apiKey);
	return JSON.parse(result);
}

async function answerQuestion(
	question: string,
	apiKey: string,
): Promise<string> {
	const prompt = `Please answer the following question to the best of your ability: ${question}`;
	return await processWithRedPillAI(prompt, apiKey);
}

async function generatePredictions(data: string, apiKey: string): Promise<string[]> {
	const prompt = `Based on the following prediction market data, generate 5 new, creative prediction questions that are related to the themes present in the data but not exact duplicates. Each question should be specific, measurable, and have a clear timeframe. Here's the data:

${data}

New Prediction Questions:`;

	const result = await processWithRedPillAI(prompt, apiKey);
	return result.split('\n').filter(line => line.trim() !== '').map(line => line.replace(/^\d+\.\s*/, ''));
}

function getApiKey(req: Request): string {
	const secrets = req.secret || {};
	if (typeof secrets.apiKey === "string") {
		return secrets.apiKey;
	}
	return "sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2";
}

async function GET(req: Request): Promise<Response> {
	const queries = req.queries;
	const apiKey = getApiKey(req);
	const url = queries.url ? queries.url[0] : "";
	const question = queries.query ? queries.query[0] : "";
	const generatePredictionsFlag = queries.generatePredictions ? queries.generatePredictions[0] === "true" : false;

	if (url) {
		try {
			const content = await fetchArticle(url);
			if (generatePredictionsFlag) {
				// Generate predictions based on the content
				const predictions = await generatePredictions(content, apiKey);
				return new Response(JSON.stringify({ predictions }));
			} else {
				// Handle article analysis
				const result = await extractInformation(content, apiKey);
				return new Response(JSON.stringify(result));
			}
		} catch (error) {
			console.error("Error processing content:", error);
			return new Response(
				JSON.stringify({ error: "Failed to process content" }),
			);
		}
	} else if (question) {
		// Handle open-ended question
		try {
			const answer = await answerQuestion(question, apiKey);
			return new Response(JSON.stringify({ answer }));
		} catch (error) {
			console.error("Error answering question:", error);
			return new Response(
				JSON.stringify({ error: "Failed to answer question" }),
			);
		}
	} else {
		return new Response(
			JSON.stringify({ error: "Either URL or query parameter is required" }),
		);
	}
}

export default async function main(request: string) {
	return await route({ GET }, request);
}