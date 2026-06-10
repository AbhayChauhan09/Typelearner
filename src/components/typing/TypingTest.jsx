import TypingStats from "./TypingStats"
import TypingText from "./TypingText"
import TypingInput from "./TypingInput"
import CompletionCard from "./CompletionCard"

import typingWords from "../../data/typingWords"

import useTyping from "../../hooks/useTyping"
import useTimer from "../../hooks/useTimer"

import {
  calculateAccuracy,
  calculateWPM,
} from "../../utils/calculateStats"

function TypingTest() {
  const text = typingWords[0]

  const {
    typedText,
    currentIndex,
    handleTyping,
    isTyping,
    isCompleted,
    resetTyping,
  } = useTyping(text)

  const {
    timeLeft,
    resetTimer,
  } = useTimer(
    isTyping,
    isCompleted
  )

  const timeSpent = 60 - timeLeft

  const accuracy = calculateAccuracy(
    text,
    typedText
  )

  const wpm = calculateWPM(
    typedText,
    timeSpent
  )

  const sessionEnded =
    timeLeft === 0 || isCompleted

  function handleRestart() {
    resetTyping()
    resetTimer()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[82vh]">

      <div className="w-full flex flex-col items-center">

        {!sessionEnded ? (
          <div className="flex flex-col items-center gap-14">

            <TypingStats
              wpm={wpm}
              accuracy={accuracy}
              timeLeft={timeLeft}
            />

            <TypingText
              text={text}
              typedText={typedText}
              currentIndex={currentIndex}
            />

            <TypingInput
              typedText={typedText}
              handleTyping={handleTyping}
              disabled={sessionEnded}
            />

          </div>
        ) : (
          <CompletionCard
            wpm={wpm}
            accuracy={accuracy}
            onRestart={handleRestart}
          />
        )}

      </div>

    </div>
  )
}

export default TypingTest