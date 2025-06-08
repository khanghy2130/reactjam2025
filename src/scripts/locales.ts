export const allLanguages = ["en"] as const
/// , "ru", "es", "pt"  Русский  Español  Português
export type Language = (typeof allLanguages)[number]

export type Translation = {
  langname: string
  short: {
    getanimals: string
    acceeptcards: string
    changeelement: string
    changetype: string
    clicktoinspect: string
    changeeleques: string
    changetypeques: string
    yes: string
    no: string
    undo: string
    ready: string
    goback: string
    watching: string
    waiting: string
    yin: string
    yang: string
    round: string
    share: string
  }
  carddesc: string[]
}

export const translations: Record<Language, Translation> = {
  en: {
    langname: "English",
    short: {
      getanimals: "Get animals",
      acceeptcards: "Accept",
      changeelement: "Change color?",
      changetype: "Change type?",
      clicktoinspect: "Click to inspect",
      changeeleques: "Keep type and\nchange color?",
      changetypeques: "Keep color and\nchange type?",
      yes: "Yes",
      no: "No",
      undo: "Undo",
      ready: "Ready",
      goback: "Go back",
      watching: "Watching",
      waiting: "Waiting...",
      yin: "Yin",
      yang: "Yang",
      round: "Round",
      share: "Share",
    },
    carddesc: [
      "points for each Yin\nanimal in this row.",
      "points for each\nadjacent unique color.",
      "points for each\ntiger and pig.",
      "points for each\ndog and rabbit.",
      "points for each\nsnake and dragon.",
      "points. Can be any\ncolor, but not a\nunique color.",
      "points for each\nanimal on the edge.",
      "points for each\nanimal that is adjacent\nto exactly 2 other animals.",
      "points for each\nanimal that is adjacent\nto exactly 2 other animals.",
      "points for each\nchicken and monkey.",
      "points for each\nhorse and goat.",
      "points. Can be any\ncolor, but not a\nunique color.",

      "points for each\nadjacent missing animal\nthat could be placed there.",
      "points for each\nanimal on the edge.",
      "points for each\nrat and ox.",
      "points for each\nadjacent missing animal\nthat could be placed there.",
      "points for each Yang\nanimal in this row.",
      "points. Can be any\ncolor, but not a\nunique color.",
      "points for each Yin\nanimal in this column.",
      "points for each\npig, rabbit, or goat.",
      "points for each\nadjacent unique color.",
      "points for each Yang\nanimal in this column.",
      "points for each unique\ncolor in this row.",
      "points. Can be any\ncolor, but not a\nunique color.",

      "points for each\ngreen (Wood) animal.",
      "points for each\nred (Fire) animal.",
      "points for each\nyellow (Earth) animal.",
      "points for each\nwhite (Metal) animal.",
      "points for each\nblue (Water) animal.",
      "points. Can be any\ncolor, but not a\nunique color.",
      "points for each\ndiagonally adjacent\ngreen (Wood) animal.",
      "points for each\ndiagonally adjacent\nred (Fire) animal.",
      "points for each\ndiagonally adjacent\nyellow (Earth) animal.",
      "points for each\ndiagonally adjacent\nwhite (Metal) animal.",
      "points for each\ndiagonally adjacent\nblue (Water) animal.",
      "points. Can be any\ncolor, but not a\nunique color.",

      "points for each\nadjacent Yin animal.",
      "points for each\ndiagonally adjacent\nYang animal.",
      "points for each\nsnake, chicken, or ox.",
      "points for each\nrat, dragon, or monkey.",
      "points for each\ndiagonally adjacent\nYin animal.",
      "points. Can be any\ncolor, but not a\nunique color.",
      "points for each\ncolorful (Flux) animal.",
      "points for each\ncolorful (Flux) animal.",
      "points for each\nadjacent Yang animal.",
      "points for each unique\ncolor in this column.",
      "points for each\ndog, tiger, or horse.",
      "points. Can be any\ncolor, but not a\nunique color.",
    ],
  },
}
