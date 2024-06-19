import { MediaRendering } from '@/components/media-rendering';

export const Video = () => {
  return (
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* DESKTOP  */}
        <div className=" flex h-[656px] w-full items-center justify-center py-16 ">
          <iframe
            width="960"
            height="415"
            src="https://www.youtube.com/embed/gTqcyUQ7esg?si=HbDm6T6I1EiuRggA"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* MOBILE  */}
        <div className=" flex h-[256px] w-full items-center justify-center px-5 py-6 ">
          <iframe
            width="560"
            height="215"
            src="https://www.youtube.com/embed/gTqcyUQ7esg?si=HbDm6T6I1EiuRggA"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </MediaRendering>
    </>
  );
};
