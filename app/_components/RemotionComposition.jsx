"use client";

import React, { useEffect, useMemo } from "react";

import {
  Img,
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Audio,
} from "remotion";

const RemotionComposition = ({ videoData, setDurationInFrame }) => {
  const captions = videoData?.captionJson || [];
  const { fps } = useVideoConfig();
  const imageList = videoData?.images || [];
  const frame = useCurrentFrame();

  // Compute total duration once
  const totalDuration = useMemo(() => {
    const lastCaption = captions[captions.length - 1];
    if (!lastCaption) return fps * 5; // default 5 seconds
    return Math.round(lastCaption.end * fps);
  }, [captions, fps]);

  // Pass duration to parent
  useEffect(() => {
    setDurationInFrame(totalDuration);
  }, [totalDuration, setDurationInFrame]);

  // Duration per image
  const framesPerImage = Math.floor(totalDuration / imageList.length);

  const scale = (index, startTime, duration) =>
    interpolate(
      frame,
      [startTime, startTime + duration / 2, startTime + duration],
      index % 2 === 0 ? [1, 1.1, 1] : [1.1, 1, 1.1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

  const getCurrentCaption = () => {
    const currentTime = frame / fps;
    const currentCaption = captions?.find(
      (item) => currentTime >= item?.start && currentTime <= item?.end
    );
    return currentCaption ? currentCaption?.word : "";
  };

  return (
    <>
      <AbsoluteFill>
        {imageList.map((item, index) => {
          const startTime = index * framesPerImage;
          const duration = framesPerImage;
          return (
            <Sequence key={index} from={startTime} durationInFrames={duration}>
              <AbsoluteFill>
                <Img
                  src={item}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale(index, startTime, duration)})`,
                  }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 80,
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "60px",
          fontWeight: "bold",
          color: "white",
          textShadow: "0 0 20px rgba(0, 0, 0, 0.7)",
          margin: 0,
        }}>
          {getCurrentCaption()}
        </h2>
      </AbsoluteFill>

      {videoData?.audioUrl && <Audio src={videoData?.audioUrl} />}
    </>
  );
};

export default RemotionComposition;
