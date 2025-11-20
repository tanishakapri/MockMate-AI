"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { WebCamContext } from "@/app/dashboard/layout";
import { GoogleGenerativeAI } from "@google/generative-ai";


async function retryRequest(fn, retries = 3, delay = 1200) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    console.warn(`Retrying... attempts left: ${retries}`);
    await new Promise((res) => setTimeout(res, delay));
    return retryRequest(fn, retries - 1, delay * 1.6);
  }
}

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const { user } = useUser();
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);

  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        toast("Recording saved. Click Submit to send your answer.");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setSubmitted(false);
    } catch (err) {
      toast("Microphone permission denied!");
    }
  };


  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };


  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast("Please record your answer first");
      return null;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",   
    });

    return await retryRequest(
      () =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result.split(",")[1];

              const result = await model.generateContent([
                "Transcribe the following audio clearly:",
                {
                  inlineData: {
                    data: base64Audio,
                    mimeType: "audio/webm",
                  },
                },
              ]);

              resolve(result.response.text());
            } catch (err) {
              reject(err);
            }
          };
          reader.readAsDataURL(audioBlob);
        }),
      3,
      1200
    );
  };


  const submitAnswer = async () => {
    if (submitted) return toast("Already submitted!");

    if (!audioBlob) {
      toast("Please record your answer first");
      return;
    }

    try {
      setLoading(true);
      setLoadingProgress("Transcribing audio... (33%)");

      const text = await transcribeAudio();
      if (!text) return;

      setLoadingProgress("Generating AI feedback... (66%)");

      const feedbackPrompt = `
        Question: "${mockInterviewQuestion[activeQuestionIndex]?.Question}"
        User Answer: "${text}"

        Return JSON only:
        {
          "rating": number,
          "feedback": "short feedback"
        }
      `;

      const aiResponse = await retryRequest(() =>
        chatSession.sendMessage(feedbackPrompt)
      );

      let raw = aiResponse.response.text();
      raw = raw.replace(/```json|```/g, "");

      const json = JSON.parse(raw);

      setLoadingProgress("Saving your answer... (99%)");

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        questionNumber: activeQuestionIndex + 1,
        question: mockInterviewQuestion[activeQuestionIndex]?.Question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
        userAns: text,
        feedback: json.feedback,
        rating: json.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD"),
      });

      setSubmitted(true);
      toast("Answer Submitted Successfully!");
    } catch (err) {
      console.error(err);
      toast("Submission failed after retries!");
    } finally {
      setLoading(false);
      setLoadingProgress("");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">

      {/* CAMERA */}
      <div className="flex flex-col justify-center items-center rounded-lg p-5 bg-black mt-4 w-[30rem]">
        {webCamEnabled ? (
          <Webcam style={{ height: 250, width: "100%" }} mirrored />
        ) : (
          <Image src="/camera.jpg" width={200} height={200} alt="Camera" />
        )}
      </div>

      {/* Buttons */}
      <div className="md:flex mt-4 md:mt-8 md:gap-5">

        <Button onClick={() => setWebCamEnabled((p) => !p)}>
          {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
        </Button>

        <Button
          variant="outline"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
        >
          {isRecording ? (
            <span className="text-red-400 flex gap-2">
              <Mic /> Stop Recording
            </span>
          ) : (
            "Record Answer"
          )}
        </Button>
      </div>

      {/* SUBMIT BUTTON */}
      <Button
        className="mt-5"
        onClick={submitAnswer}
        disabled={loading || !audioBlob || submitted}
      >
        {submitted 
          ? "Submitted ✔" 
          : loading 
            ? loadingProgress 
            : "Submit Answer"}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;












// "use client";

// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React, { useContext, useState, useRef } from "react";
// import Webcam from "react-webcam";
// import { Mic } from "lucide-react";
// import { toast } from "sonner";
// import { chatSession } from "@/utils/GeminiAIModal";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";
// import { WebCamContext } from "@/app/dashboard/layout";
// import { GoogleGenerativeAI } from "@google/generative-ai";


// async function retryRequest(fn, retries = 3, delay = 1200) {
//   try {
//     return await fn();
//   } catch (err) {
//     if (retries <= 0) throw err;
//     console.warn(`Retrying... attempts left: ${retries}`);
//     await new Promise((res) => setTimeout(res, delay));
//     return retryRequest(fn, retries - 1, delay * 1.6);
//   }
// }

// const RecordAnswerSection = ({
//   mockInterviewQuestion,
//   activeQuestionIndex,
//   interviewData,
// }) => {
//   const { user } = useUser();
//   const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);

//   const [loading, setLoading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   const genAI = new GoogleGenerativeAI(
//     process.env.NEXT_PUBLIC_GEMINI_API_KEY
//   );


//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//       mediaRecorderRef.current = new MediaRecorder(stream);
//       chunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) chunksRef.current.push(event.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         setAudioBlob(blob);
//         toast("Recording saved. Click Submit to send your answer.");
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//       setSubmitted(false);
//     } catch (err) {
//       toast("Microphone permission denied!");
//     }
//   };


//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };


//   const transcribeAudio = async () => {
//     if (!audioBlob) {
//       toast("Please record your answer first");
//       return null;
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",   
//     });

//     return await retryRequest(
//       () =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = async () => {
//             try {
//               const base64Audio = reader.result.split(",")[1];

//               const result = await model.generateContent([
//                 "Transcribe the following audio clearly:",
//                 {
//                   inlineData: {
//                     data: base64Audio,
//                     mimeType: "audio/webm",
//                   },
//                 },
//               ]);

//               resolve(result.response.text());
//             } catch (err) {
//               reject(err);
//             }
//           };
//           reader.readAsDataURL(audioBlob);
//         }),
//       3,
//       1200
//     );
//   };


//   const submitAnswer = async () => {
//     if (submitted) return toast("Already submitted!");

//     if (!audioBlob) {
//       toast("Please record your answer first");
//       return;
//     }

//     try {
//       setLoading(true);

//       const text = await transcribeAudio();
//       if (!text) return;

//       const feedbackPrompt = `
//         Question: "${mockInterviewQuestion[activeQuestionIndex]?.Question}"
//         User Answer: "${text}"

//         Return JSON only:
//         {
//           "rating": number,
//           "feedback": "short feedback"
//         }
//       `;

//       const aiResponse = await retryRequest(() =>
//         chatSession.sendMessage(feedbackPrompt)
//       );

//       let raw = aiResponse.response.text();
//       raw = raw.replace(/```json|```/g, "");

//       const json = JSON.parse(raw);

//       await db.insert(UserAnswer).values({
//         mockIdRef: interviewData?.mockId,
//         questionNumber: activeQuestionIndex + 1,
//         question: mockInterviewQuestion[activeQuestionIndex]?.Question,
//         correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
//         userAns: text,
//         feedback: json.feedback,
//         rating: json.rating,
//         userEmail: user?.primaryEmailAddress?.emailAddress,
//         createdAt: moment().format("YYYY-MM-DD"),
//       });

//       setSubmitted(true);
//       toast("Answer Submitted Successfully!");
//     } catch (err) {
//       console.error(err);
//       toast("Submission failed after retries!");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="flex flex-col items-center justify-center overflow-hidden">

//       {/* CAMERA */}
//       <div className="flex flex-col justify-center items-center rounded-lg p-5 bg-black mt-4 w-[30rem]">
//         {webCamEnabled ? (
//           <Webcam style={{ height: 250, width: "100%" }} mirrored />
//         ) : (
//           <Image src="/camera.jpg" width={200} height={200} alt="Camera" />
//         )}
//       </div>

//       {/* Buttons */}
//       <div className="md:flex mt-4 md:mt-8 md:gap-5">

//         <Button onClick={() => setWebCamEnabled((p) => !p)}>
//           {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
//         </Button>

//         <Button
//           variant="outline"
//           onClick={isRecording ? stopRecording : startRecording}
//           disabled={loading}
//         >
//           {isRecording ? (
//             <span className="text-red-400 flex gap-2">
//               <Mic /> Stop Recording
//             </span>
//           ) : (
//             "Record Answer"
//           )}
//         </Button>
//       </div>

//       {/* SUBMIT BUTTON */}
//       <Button
//         className="mt-5"
//         onClick={submitAnswer}
//         disabled={loading || !audioBlob || submitted}
//       >
//         {submitted ? "Submitted ✔" : loading ? "Submitting..." : "Submit Answer"}
//       </Button>
//     </div>
//   );
// };

// export default RecordAnswerSection;










// == corect==

// "use client";

// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React, { useContext, useState, useRef } from "react";
// import Webcam from "react-webcam";
// import { Mic } from "lucide-react";
// import { toast } from "sonner";
// import { chatSession } from "@/utils/GeminiAIModal";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";
// import { WebCamContext } from "@/app/dashboard/layout";
// import { GoogleGenerativeAI } from "@google/generative-ai";


// async function retryRequest(fn, retries = 3, delay = 1200) {
//   try {
//     return await fn();
//   } catch (err) {
//     if (retries <= 0) throw err;
//     console.warn(`Retrying... attempts left: ${retries}`);
//     await new Promise((res) => setTimeout(res, delay));
//     return retryRequest(fn, retries - 1, delay * 1.6);
//   }
// }

// const RecordAnswerSection = ({
//   mockInterviewQuestion,
//   activeQuestionIndex,
//   interviewData,
// }) => {
//   const { user } = useUser();
//   const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);

//   const [loading, setLoading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [transcript, setTranscript] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   const genAI = new GoogleGenerativeAI(
//     process.env.NEXT_PUBLIC_GEMINI_API_KEY
//   );


//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//       mediaRecorderRef.current = new MediaRecorder(stream);
//       chunksRef.current = [];

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) chunksRef.current.push(event.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         setAudioBlob(blob);
//         toast("Recording saved. Click Submit.");
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//       setSubmitted(false);
//     } catch (err) {
//       toast("Microphone permission denied!");
//     }
//   };


//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };


//   const transcribeAudio = async () => {
//     if (!audioBlob) {
//       toast("Please record your answer first");
//       return null;
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",   
//     });

//     return await retryRequest(
//       () =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = async () => {
//             try {
//               const base64Audio = reader.result.split(",")[1];

//               const result = await model.generateContent([
//                 "Transcribe the following audio clearly:",
//                 {
//                   inlineData: {
//                     data: base64Audio,
//                     mimeType: "audio/webm",
//                   },
//                 },
//               ]);

//               resolve(result.response.text());
//             } catch (err) {
//               reject(err);
//             }
//           };
//           reader.readAsDataURL(audioBlob);
//         }),
//       3,
//       1200
//     );
//   };


//   const submitAnswer = async () => {
//     if (submitted) return toast("Already submitted!");

//     try {
//       setLoading(true);

//       const text = await transcribeAudio();
//       if (!text) return;

//       setTranscript(text);

//       const feedbackPrompt = `
//         Question: "${mockInterviewQuestion[activeQuestionIndex]?.Question}"
//         User Answer: "${text}"

//         Return JSON only:
//         {
//           "rating": number,
//           "feedback": "short feedback"
//         }
//       `;

//       const aiResponse = await retryRequest(() =>
//         chatSession.sendMessage(feedbackPrompt)
//       );

//       let raw = aiResponse.response.text();
//       raw = raw.replace(/```json|```/g, "");

//       const json = JSON.parse(raw);

//       await db.insert(UserAnswer).values({
//         mockIdRef: interviewData?.mockId,
//         questionNumber: activeQuestionIndex + 1,
//         question: mockInterviewQuestion[activeQuestionIndex]?.Question,
//         correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
//         userAns: text,
//         feedback: json.feedback,
//         rating: json.rating,
//         userEmail: user?.primaryEmailAddress?.emailAddress,
//         createdAt: moment().format("YYYY-MM-DD"),
//       });

//       setSubmitted(true);
//       toast("Answer Submitted!");
//     } catch (err) {
//       console.error(err);
//       toast("Submission failed after retries!");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="flex flex-col items-center justify-center overflow-hidden">

//       {/* CAMERA */}
//       <div className="flex flex-col justify-center items-center rounded-lg p-5 bg-black mt-4 w-[30rem]">
//         {webCamEnabled ? (
//           <Webcam style={{ height: 250, width: "100%" }} mirrored />
//         ) : (
//           <Image src="/camera.jpg" width={200} height={200} alt="Camera" />
//         )}
//       </div>

//       {/* Buttons */}
//       <div className="md:flex mt-4 md:mt-8 md:gap-5">

//         <Button onClick={() => setWebCamEnabled((p) => !p)}>
//           {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
//         </Button>

//         <Button
//           variant="outline"
//           onClick={isRecording ? stopRecording : startRecording}
//           disabled={loading}
//         >
//           {isRecording ? (
//             <span className="text-red-400 flex gap-2">
//               <Mic /> Stop Recording
//             </span>
//           ) : (
//             "Record Answer"
//           )}
//         </Button>
//       </div>

//       {/* SUBMIT BUTTON */}
//       <Button
//         className="mt-5"
//         onClick={submitAnswer}
//         disabled={loading || !audioBlob || submitted}
//       >
//         {submitted ? "Submitted ✔" : loading ? "Submitting..." : "Submit Answer"}
//       </Button>

//       {transcript && (
//         <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-xl">
//           <h3 className="font-bold">Transcription:</h3>
//           <p>{transcript}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecordAnswerSection;





