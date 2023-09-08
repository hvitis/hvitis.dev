export default function humanize(phrase) {
  // Replace all underscores with spaces.
  phrase = phrase.toLowerCase()
  phrase = phrase.replace(/_/g, ' ')

  // Split the phrase into words.
  let words = phrase.split(' ')

  // Capitalize the first letter of each word.
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
  }

  // Join the words back together with a space.
  return words.join(' ')
}
