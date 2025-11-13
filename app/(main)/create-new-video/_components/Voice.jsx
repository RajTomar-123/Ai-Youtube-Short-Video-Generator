import React, { useState } from "react";
import { ScrollArea } from "../../../../components/ui/scroll-area";

const voiceOptions = [
  { value: "af_sarah", name: "Sarah (Female)" },
  { value: "af_sky", name: "Sky (Female)" },
  { value: "am_michael", name: "Michael (Male)" },
  { value: "af_clara", name: "Clara (Female)" },
];

const Voice = ({ onHandleInputChange }) => {
  const [selectedVoice, setSelectedVoice] = useState();
  
  return (
    <div className="mt-2">
      <h2>Video Voice</h2>
      <p className="text-sm text-gray-400">Select voice for your video</p>

      <ScrollArea className="h-[200px] w-full p-4">
        <div className="grid grid-cols-2 gap-3">
          {voiceOptions.map((voice, index) => (
            <h2 className={`cursor-pointer p-3 dark:bg-slate-900 dark:border-white 
              rounded-lg hover:border ${ voice.name === selectedVoice && "border"}`} 
              onClick={()=> {setSelectedVoice(voice.name); onHandleInputChange('voice', voice.value)}} key={index}>
              {voice.name}
            </h2>
          ))}
        </div>
      </ScrollArea>

    </div>
  );
};

export default Voice;
