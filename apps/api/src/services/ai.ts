import OpenAI from 'openai';
import { Agent, OpenAIChatCompletionsModel, OpenAIResponsesModel, Runner, setTracingDisabled } from '@openai/agents';
import { z } from 'zod';
import { config } from '../config.js';

// Anonymous learning content is not exported to a second provider for tracing.
setTracingDisabled(true);
let reserveProvider: (kind: string) => void = () => {};
export const configureProviderUsage = (reserve: (kind: string) => void) => { reserveProvider = reserve; };
export const reserveProviderCall = (kind: string) => reserveProvider(kind);
export function textModel(modelId?: string) {
  const router = config.AI_PROVIDER === 'openrouter';
  const apiKey = router ? config.OPENROUTER_API_KEY : config.OPENAI_API_KEY;
  if (!apiKey) throw new Error('AI provider is not configured');
  const client = new OpenAI({ apiKey, ...(router ? { baseURL: 'https://openrouter.ai/api/v1', defaultHeaders: { 'X-OpenRouter-Title': 'òye.' } } : {}), timeout: 90_000, maxRetries: 0 });
  const model = router ? new OpenAIChatCompletionsModel(client, modelId || config.OPENROUTER_TEXT_MODEL) : new OpenAIResponsesModel(client, modelId || config.OPENAI_TEXT_MODEL);
  const response = model.getResponse.bind(model); const stream = model.getStreamedResponse.bind(model);
  model.getResponse = (...args) => { reserveProviderCall('provider-text'); return response(...args); };
  model.getStreamedResponse = (...args) => { reserveProviderCall('provider-text'); return stream(...args); };
  return model;
}
export const providerInfo = () => ({ provider: config.AI_PROVIDER, model: config.AI_PROVIDER === 'openrouter' ? config.OPENROUTER_TEXT_MODEL : config.OPENAI_TEXT_MODEL, configured: Boolean(config.AI_PROVIDER === 'openrouter' ? config.OPENROUTER_API_KEY : config.OPENAI_API_KEY) });
export async function generate<T extends z.ZodType>(name: string, instructions: string, input: unknown, outputType: T, signal?: AbortSignal, modelId?: string): Promise<z.infer<T>> {
  const agent = new Agent({ name, model: textModel(modelId), instructions, outputType, modelSettings: { maxTokens: config.AI_MAX_OUTPUT_TOKENS } });
  const runner = new Runner({ tracingDisabled: true });
  const result = await runner.run(agent, JSON.stringify(input), { maxTurns: 1, signal: signal || AbortSignal.timeout(100_000) });
  return outputType.parse(result.finalOutput);
}
export const evaluationModelId = () => config.AI_PROVIDER === 'openrouter' ? config.OPENROUTER_EVALUATION_MODEL : config.OPENAI_EVALUATION_MODEL;
export const generateEvaluation = <T extends z.ZodType>(name: string, instructions: string, input: unknown, outputType: T, signal?: AbortSignal) => generate(name, instructions, input, outputType, signal, evaluationModelId());

export const lessonModelId = () => config.AI_PROVIDER === 'openrouter' ? config.OPENROUTER_LESSON_MODEL : config.OPENAI_LESSON_MODEL;
export const generateLesson = <T extends z.ZodType>(name: string, instructions: string, input: unknown, outputType: T, signal?: AbortSignal) => generate(name, instructions, input, outputType, signal, lessonModelId());

export const tutorModelId = () => config.AI_PROVIDER === 'openrouter' ? config.OPENROUTER_TUTOR_MODEL : config.OPENAI_TUTOR_MODEL;
