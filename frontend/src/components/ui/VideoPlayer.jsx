/* eslint-disable no-unused-vars */
export default function VideoPlayer({ url }) {
  const getYouTubeEmbedUrl = (videoUrl) => {
    try {
      const urlObj = new URL(videoUrl);
      const videoId = urlObj.searchParams.get("v");
      if (urlObj.hostname === "www.youtube.com" && videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 hover:underline"
      >
        {url}
      </a>
    );
  }

  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        className="w-full h-full rounded-lg"
      />
    </div>
  );
}
