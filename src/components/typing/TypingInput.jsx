function TypingInput({
  typedText,
  handleTyping,
  disabled,
}) {
  return (
    <div className="flex justify-center w-full mt-10">

      <div
        className="
          w-full
          max-w-5xl
          h-[95px]
          bg-[#171A21]
          rounded-[32px]
          border
          border-[#2a2d35]
          shadow-xl
          flex
          items-center
          px-10
        "
      >

        <input
          type="text"
          value={typedText}
          onChange={(e) =>
            handleTyping(e.target.value)
          }
          placeholder="Start typing here..."
          disabled={disabled}
          className="
            w-full
            bg-transparent
            text-[42px]
            text-white
            outline-none
            placeholder:text-[#6B7280]
          "
        />

      </div>

    </div>
  )
}

export default TypingInput