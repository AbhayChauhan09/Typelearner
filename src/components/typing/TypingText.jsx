function TypingText({ text, typedText, currentIndex }) {
  return (
    <div
      className="
        w-full
        max-w-5xl
        min-h-[320px]
        mb-10
        bg-[#171A21]
        rounded-[32px]
        border
        border-[#2a2d35]
        shadow-xl
      "
    >
      <div
        className="
          px-16
          py-12
          text-[42px]
          leading-[1.8]
          tracking-wide
        "
      >
        {text.split("").map((char, index) => {
          let textColor = "text-[#6B7280]"

          if (index < typedText.length) {
            textColor =
              typedText[index] === char
                ? "text-white"
                : "text-[#C97B63]"
          }

          const isCurrent = index === currentIndex

          return (
            <span
              key={index}
              className={`
                ${textColor}
                ${index === 0 ? "pl-10 inline-block" : ""}
                ${
                  isCurrent
                    ? "border-l-2 border-[#C8B6A6]"
                    : ""
                }
              `}
            >
              {char}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default TypingText