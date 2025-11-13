"use client"

import { Input } from '../../../../components/ui/input'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Button } from '../../../../components/ui/button'
import { Textarea } from "../../../../components/ui/textarea"
import { Loader2Icon, SpaceIcon } from 'lucide-react'
import axios from 'axios'
import { useAuthContext } from '../../../provider'

const Suggestions = [
  "Kids Story",
  "Movie Stories",
  "AI Innovations",
  "Space Mysteries",
  "Horror Stories",
  "Mythological Tales",
  "Tech Breakthroughs",
  "True Crime Stories",
  "Fantasy Adventures",
  "Science Experiments",
  "Motivational Stories",
]

const Topic = ({ onHandleInputChange }) => {
  const [selectedTopic, setSelectedTopic] = useState();
  const [selectedScriptIndex, setSelectedScriptIndex] = useState();
  const [scripts, setScripts] = useState();
  const [loading, setLoading] = useState(false);
  const{user} = useAuthContext();

  const GenerateScript = async () => {

    if (user?.credits <= 0) {
      toast('Please add more credits!')
      return;
    }

    setLoading(true);
    setSelectedScriptIndex(null);
    try {
      const result = await axios.post("/api/generate-script", {
        topic: selectedTopic,
      });
      console.log("✅ Scripts:", result.data);
      setScripts(result.data?.scripts);
    } catch (err) {
      console.error("❌ Error fetching script:", err);
    }
    setLoading(false);
  };


  return (
    <div>
      <h2 className='mb-1'>Video Title</h2>
      <Input placeholder="Enter video title" onChange={(event) => onHandleInputChange('title', event?.target.value)} />

      <div className='mt-5'>
        <h2>Video Topic</h2>
        <p className='text-sm text-gray-600'>Select topic for your video</p>

        <Tabs defaultValue="Suggestions" className="w-full mt-2">
          <TabsList>
            <TabsTrigger value="Suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="Your_topic">Your Topic</TabsTrigger>
          </TabsList>

          <TabsContent value="Suggestions">
            <div>
              {Suggestions.map((Suggestion, index) => (
                <Button
                  variant={Suggestion === selectedTopic ? "default" : "outline"} // optional
                  key={index}
                  className={`m-1 ${Suggestion === selectedTopic ? "bg-secondary text-gray-300 border border-white" : ""}`}
                  onClick={() => {
                    setSelectedTopic(Suggestion);
                    onHandleInputChange("topic", Suggestion);
                  }}>
                  {Suggestion}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="Your_topic">
            <div>
              <h2>Enter your own Topic</h2>
              <Textarea
                placeholder="Enter your topic"
                onChange={(event) => onHandleInputChange("topic", event.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        {scripts?.length > 0 &&
          <div className='mt-3'>
            <h2>Select the Script</h2>
            <div className='grid grid-cols-2 gap-5 mt-1'>
              {
                scripts?.map((item, index) => (
                  <div key={index} className={`p-3 border rounded-lg cursor-pointer ${selectedScriptIndex == index &&
                    'border-white bg-secondary'}`} onClick={() => { setSelectedScriptIndex(index); onHandleInputChange('script', item?.content) }}>
                    <h2 className='line-clamp-4 text-sm text-gray-300'>{item.content}</h2>
                  </div>
                ))
              }
            </div>
          </div>
        }

      </div>
      {!scripts && <Button className='mt-3' onClick={GenerateScript} size='sm' disabled={loading} >
        {loading ? <Loader2Icon className='animate-spin' /> : <SpaceIcon />}Generate Script</Button>}
    </div>
  )
}

export default Topic
