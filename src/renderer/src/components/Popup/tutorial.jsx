import { useState, useEffect } from 'react'
import CloseIcon from '@/icons/window/CloseIcon.jsx'
import Img1 from '@/assets/image1.png'
import Img2 from '@/assets/image2.png'
import Img3 from '@/assets/image3.png'
import Img4 from '@/assets/image4.png'

export default function TutorialPopup({ Set }) {
  const [isStep, setStep] = useState(0)
  useEffect(() => {
    console.log('isStep', isStep)
  }, [isStep])

  const dataSteps = [
    {
      text: 'Make sure that in the warzone, you have the RARA AUDIO APP selected as the output. ',
      img: Img1
    },
    {
      text: 'Select your output device  (VoiceMeeter or your favorite audio mixer). ',
      img: Img2
    },
    {
      text: 'Select your audio output devices.',
      img: Img3
    },
    {
      text: 'Start testing the audio settings that you like the most. ',
      img: Img4
    }
  ]

  return (
    <div className="min-w-[750px] relative min-h-[550px] bg-secundary flex justify-center transition-all items-center shadow shadow-black/20 rounded-md pt-8 flex-col">
      <button
        className="absolute cursor-pointer hover:fill-[var(--color-green)] top-5 right-5"
        onClick={() => Set(false)}
      >
        <CloseIcon />
      </button>
      <h1 className="font-bold text-2xl mb-5 -mt-10 ">
        {' '}
        Make sure you have the settings correctly
      </h1>
      <p className="w-[80%] text-center text-xl text-[var(--color-orange)] mb-5">
        {dataSteps[isStep]?.text}
      </p>
      <img src={dataSteps[isStep]?.img} className="w-[700px]" />
      <div className="flex justify-center transition-all items-center  gap-x-2  absolute right-3 bottom-3">
        {isStep > 0 && (
          <button onClick={() => setStep(() => isStep - 1)} className="btn !text-sm  !py-2 !px-5">
            Back Step
          </button>
        )}
        {isStep == dataSteps.length - 1 ? (
          <button
            onClick={() => {
              Set(false)
            }}
            className="btn  btn-main !text-sm !py-2 !px-5"
          >
            Close ({isStep + 1}/{dataSteps.length})
          </button>
        ) : (
          <button
            onClick={() => setStep(() => isStep + 1)}
            className="btn btn-main !text-sm !py-2 !px-5"
          >
            Next Step ({isStep + 1}/{dataSteps.length})
          </button>
        )}
      </div>
    </div>
  )
}
