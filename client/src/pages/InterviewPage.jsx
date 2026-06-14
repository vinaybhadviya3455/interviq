import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import Step1SetUp from '../components/Step1SetUp'
import Step2Interview from '../components/Step2Interview'
import Step3Report from '../components/Step3Report'

function InterviewPage() {
    const [step,setStep]=useState(1) //
    const [interviewData,setInerviewData]=useState(null)
    const navigate = useNavigate()

    const handleBack = () => {
        if (step === 2) {
            const confirmLeave = window.confirm("Your interview is in progress. Are you sure you want to leave? Your progress will be lost.")
            if (!confirmLeave) return
        }
        navigate("/")
    }

  return (
    <div className='min-h-screen bg-gray-50 relative'>
        <button
            onClick={handleBack}
            className='absolute top-8 left-8 z-10 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
            <FaArrowLeft className='text-gray-600' />
        </button>

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