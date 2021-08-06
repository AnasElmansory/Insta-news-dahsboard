const arabic = /[\u0600-\u06FF]/

export default function isArabic(input: string): boolean {
  return arabic.test(input)
}
