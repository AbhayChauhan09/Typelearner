function CompletionCard({
  wpm,
  accuracy,
  onRestart,
}) {
  return (
    <div
      className="
        w-full
        max-w-4xl
        min-h-[500px]
        bg-[#171A21]
        rounded-[40px]
        px-16
        py-20
        shadow-2xl
        border
        border-[#2a2d35]
        flex
        flex-col
        items-center
        justify-center
      "
    >

      {/* Heading */}
      <h2
        className="
          text-7xl
          font-bold
          text-[#C8B6A6]
          mb-14
          text-center
        "
      >
        Session Complete
      </h2>

      {/* Stats */}
      <div
        className="
          flex
          items-center
          justify-center
          gap-20
          md:gap-44
        "
      >

        {/* WPM */}
        <div className="flex flex-col items-center">
          <p className="text-gray-400 text-2xl mb-4">
            WPM
          </p>

          <h3 className="text-6xl font-bold text-white">
            {wpm}
          </h3>
        </div>

        {/* Divider */}
        <div className="w-[2px] h-32 bg-[#2f3542]"></div>

        {/* Accuracy */}
        <div className="flex flex-col items-center">
          <p className="text-gray-400 text-2xl mb-4">
            Accuracy
          </p>

          <h3 className="text-6xl font-bold text-white">
            {accuracy}%
          </h3>
        </div>

      </div>

      {/* Space Between Stats and Button */}
      <div className="h-8"></div>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="
          px-12
          py-5
          min-w-[280px]
          rounded-3xl
          bg-[#C8B6A6]
          text-black
          text-2xl
          font-bold
          shadow-xl
          hover:bg-[#d8c5b6]
          hover:scale-105
          active:scale-95
          transition-all
          duration-300
          cursor-pointer
        "
      >
        Restart Test
      </button>

    </div>
  )
}

export default CompletionCard