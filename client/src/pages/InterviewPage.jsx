import React from 'react'
import { useState } from 'react'
import Step1SetUp from '../components/Step1SetUp'
import Step2Interview from '../components/Step2Interview'
import Step3Report from '../components/step3Report'

function InterviewPage() {
    const [step,setStep]=useState(1)
    const [interviewData,setInerviewData]=useState(null)
  return (
    <div className='min-h-screen bg-gray-50'>
        {step===1 && (
            <Step1SetUp onStart={(data)=>{
                setInerviewData(data);
            setStep(2)}}/>
        )}

        {step===2 && (
            <Step2Interview interviewData={interviewData}
            onFinish={(report)=>{setInerviewData(report);
                setStep(3)
            }}
            />
        )}

        {step===3 && (
            <Step3Report report={interviewData}/>
        )}
    </div>
  )
}

export default InterviewPage