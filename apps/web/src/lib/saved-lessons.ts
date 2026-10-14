import { lessonSchema, type Lesson } from '@oye/shared';
const key = 'oye.savedLessons'; const scopeKey = 'oye.cacheScope';
export type SavedLesson = { lesson: Lesson; savedAt: number; scope: string };
export function cacheScope(scope: string) { const previous = localStorage.getItem(scopeKey); if (previous && previous !== scope) localStorage.removeItem(key); localStorage.setItem(scopeKey, scope); }
export function readSavedLessons(): SavedLesson[] {
  try { const scope = localStorage.getItem(scopeKey); const data = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(data)) return []; return data.slice(0, 10).flatMap(item => { const lesson = lessonSchema.safeParse(item.lesson); return lesson.success && item.scope === scope && Number.isFinite(item.savedAt) && item.savedAt > Date.now() - 30 * 86400000 ? [{ ...item, lesson: lesson.data }] : []; }); } catch { return []; }
}
export async function saveLesson(lesson: Lesson, scope: string) {
  cacheScope(scope); const list = [{ lesson: lessonSchema.parse(lesson), savedAt: Date.now(), scope }, ...readSavedLessons().filter(item => item.lesson.id !== lesson.id)].slice(0, 10); const value = JSON.stringify(list);
  if (value.length > 2 * 1024 * 1024) throw new Error('The saved lesson limit has been reached. Remove a lesson and try again.');
  if (import.meta.env.PROD) {
    if (!('serviceWorker' in navigator)) throw new Error('This lesson could not be saved. Download the text instead.');
    await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(new Error('This lesson could not be saved. Download the text instead.')), 8000))]);
  }
  localStorage.setItem(key, value);
}
export function removeSavedLesson(id: string) { localStorage.setItem(key, JSON.stringify(readSavedLessons().filter(item => item.lesson.id !== id))); }
export function clearSavedLessons() { localStorage.removeItem(key); localStorage.removeItem(scopeKey); }
export function lessonText(lesson: Lesson) {
  const c = lesson.content;
  return [c.title, c.summary, ...c.sections.flatMap(s => [s.heading, s.body, s.sourceIds.join(', ')]), ...c.examples.flatMap(e => [e.title, e.explanation, e.sourceIds.join(', ')]), c.visual.title, ...c.visual.items.map(item => item.label + ': ' + item.detail), ...c.glossary.map(word => word.term + ': ' + word.meaning), ...lesson.sources.map(source => `${source.id}. ${source.title}\n${source.url}`)].join('\n\n');
}
export function downloadText(lesson: Lesson) { const url = URL.createObjectURL(new Blob([lessonText(lesson)], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = `oye-lesson-${lesson.language}.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
