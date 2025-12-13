export async function getGeocode(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token || !query) return null;

  try {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${token}&limit=1&country=pl&language=pl`;

    const res = await fetch(endpoint);
    if (!res.ok) return null;

    const data = await res.json();
    const feature = data.features?.[0];

    if (feature && feature.center) {
      return { lng: feature.center[0], lat: feature.center[1] };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
}
