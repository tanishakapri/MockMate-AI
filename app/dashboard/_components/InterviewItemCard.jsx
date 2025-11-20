"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const InterviewItemCard = ({ interview, onDelete }) => {  // 👈 Add onDelete prop
  const router = useRouter();

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };

  const onFeedback = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };

  const handleDelete = () => {
    onDelete(interview.mockId);  // 👈 Call parent's delete function
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm flex flex-col gap-2 relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
          <p className="text-sm text-gray-600">
            {interview?.jobExperience} Years Experience
          </p>
          <p className="text-xs text-gray-400">
            Created: {interview?.createdAt ?? "N/A"}
          </p>
        </div>

        <div className="flex gap-3">
          <Trash2
            className="text-red-500 cursor-pointer hover:scale-110"
            onClick={handleDelete}  // 👈 Changed from onDelete to handleDelete
          />
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <Button onClick={onFeedback} size="sm" className="w-full">
          Feedback
        </Button>
        <Button onClick={onStart} size="sm" className="w-full">
          Start
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;






















// import React from 'react'
// import { Button } from "@/components/ui/button";
// import { useRouter } from 'next/navigation';

// const InterviewItemCard = ({interview}) => {

//     const router = useRouter()
//     const onStart = ()=>{
//         router.push("/dashboard/interview/"+interview?.mockId)
//     }
//     const onFeedback = ()=>{
//         router.push("/dashboard/interview/"+interview?.mockId+"/feedback")
//     }
//   return (
//     <div className="border border-gray-500 shadow-sm rounded-lg p-3" >
//         <h2 className='font-bold text-primary' >{interview?.jobPosition}</h2>
//         <h2 className='text-sm text-gray-600' >{interview?.jobExperience} Years of experience</h2>
//         <h2 className="text-xs text-gray-400" >Created At:{interview.createdAt}</h2>

//         <div className='flex justify-between mt-2 gap-5 ' >
//             <Button onClick={onFeedback} size="sm"  className="w-full" >Feedback</Button>
//             <Button onClick={onStart} size="sm"  className="w-full">Start</Button>
//         </div>
//     </div>

//   )
// }

// export default InterviewItemCard