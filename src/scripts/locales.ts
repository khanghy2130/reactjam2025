export type Language = "en"
/// | "es" | "pt" | "ru"

export type Translation = {
  short: {
    getanimals: string
  }
}

export const translations: Record<Language, Translation> = {
  en: {
    short: {
      getanimals: "Get animals!",
    },
  },
}
