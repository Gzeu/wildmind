// ── Animal API Service ─────────────────────────────────────────────
// Fetches animal images from the Wikipedia API.
// Later can be swapped with AI-generated images.

export interface AnimalImageResult {
  imageUrl: string;
  title: string;
}

const WIKI_API = 'https://en.wikipedia.org/w/api.php';

export async function fetchAnimalImage(animalName: string): Promise<AnimalImageResult | null> {
  try {
    const params = new URLSearchParams({
      action: 'query',
      titles: animalName,
      prop: 'pageimages',
      format: 'json',
      pithumbsize: '640',
      origin: '*',
    });

    const res = await fetch(`${WIKI_API}?${params}`);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0] as any;
    const imageUrl = page?.thumbnail?.source;
    if (!imageUrl) return null;

    return { imageUrl, title: page.title };
  } catch (err) {
    console.error('[AnimalAPI] Failed to fetch:', err);
    return null;
  }
}

// Pre-fetch and cache images for a list of animal names
export async function prefetchImages(
  names: string[]
): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  await Promise.all(
    names.map(async (name) => {
      const result = await fetchAnimalImage(name);
      if (result) cache.set(name, result.imageUrl);
    })
  );
  return cache;
}
