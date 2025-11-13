"use client";

import React, { useState } from "react";
import { Player } from "@remotion/player";
import RemotionComposition from "../../../../app/_components/RemotionComposition";

const RemotionPlayer = ({ videoData }) => {
  const [durationInFrames, setDurationInFrame] = useState(100);

  return (
    <div>
      <Player
        component={RemotionComposition}
        durationInFrames={Math.max(100, Math.round(durationInFrames))} // ✅ round to integer
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        controls
        style={{ width: "25vw", height: "70vh" }}
        inputProps={{
          videoData,
          setDurationInFrame,
        }}
      />
    </div>
  );
};

export default RemotionPlayer;
