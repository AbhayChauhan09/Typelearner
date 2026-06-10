function TypingStats({
  wpm,
  accuracy,
  timeLeft,
}) {
  return (
    <div className="flex justify-center gap-28 text-center mb-20">
      <div>
        <p className="text-muted text-base mb-2">
          WPM
        </p>

        <h2 className="text-6xl font-bold text-accent">
          {wpm}
        </h2>
      </div>

      <div>
        <p className="text-muted text-base mb-2">
          Accuracy
        </p>

        <h2 className="text-6xl font-bold text-accent">
          {accuracy}%
        </h2>
      </div>

      <div>
        <p className="text-muted text-base mb-2">
          Time
        </p>

        <h2 className="text-6xl font-bold text-accent">
          {timeLeft}s
        </h2>
      </div>
    </div>
  )
}

export default TypingStats
