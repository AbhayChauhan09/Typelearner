export function calculateAccuracy(text, typedText) {
  if (typedText.length === 0) return 100

  let correctChars = 0

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === text[i]) {
      correctChars++
    }
  }

  return Math.floor(
    (correctChars / typedText.length) * 100
  )
}

export function calculateWPM(typedText, timeSpent) {
  if (timeSpent <= 0) return 0

  const wordsTyped = typedText.trim().split(" ").length

  return Math.floor((wordsTyped / timeSpent) * 60)
}
