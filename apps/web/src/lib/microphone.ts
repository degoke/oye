export const microphoneFallback = 'Microphone access was unavailable. Type your answer or upload audio.';

/** A cancelled or unanswered permission request must not leave a live microphone behind. */
export async function acquireMicrophone(request: () => Promise<MediaStream>, isCurrent: () => boolean, timeout = 16000): Promise<{ stream: MediaStream; error?: never } | { error: Error; stream?: never }> {
  let expired = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const pending = request();
    void pending.then(media => { if (expired || !isCurrent()) media.getTracks().forEach(track => track.stop()); }, () => {});
    const media = await Promise.race([pending, new Promise<never>((_, reject) => { timer = setTimeout(() => { expired = true; reject(new Error('Microphone request timed out')); }, timeout); })]);
    if (!isCurrent()) return { error: new Error(microphoneFallback) };
    return { stream: media };
  } catch {
    expired = true;
    return { error: new Error(microphoneFallback) };
  } finally {
    clearTimeout(timer);
  }
}
