export type Language = "en" | "ru"
/// | "es" | "pt"   Español  Português

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
  }
  carddesc: string[]
}

export const translations: Record<Language, Translation> = {
  en: {
    langname: "English",
    short: {
      getanimals: "Get animals",
      acceeptcards: "Accept",
      changeelement: "Change element?",
      changetype: "Change type?",
      clicktoinspect: "Click to inspect",
      changeeleques: "Keep type and\nchange element?",
      changetypeques: "Keep element and\nchange type?",
      yes: "Yes",
      no: "No",
      undo: "Undo",
      ready: "Ready",
      goback: "Go back",
      watching: "Watching",
      waiting: "Waiting...",
      yin: "Yin",
      yang: "Yang",
    },
    carddesc: [
      "points for each Yin\nanimal in this row.\nYin animals: ox, rabbit,\nsnake, goat, chicken, pig.",
      "points for each\nadjacent unique element.",
      "points for each\ntiger and pig.",
      "points for each\ndog and rabbit.",
      "points for each\nsnake and dragon.",
      "points. Can be any\nelement, but not a\nunique element.",
      "points for each\nanimal on the edge.",
      "points for each\nanimal that is adjacent\nto exactly 2 other animals.",
      "points for each\nanimal that is adjacent\nto exactly 2 other animals.",
      "points for each\nchicken and monkey.",
      "points for each\nhorse and goat.",
      "points. Can be any\nelement, but not a\nunique element.",
      "points for each\nadjacent missing animal.",
      "points for each\nanimal on the edge.",
      "points for each\nrat and ox.",
      "points for each\nadjacent missing animal.",
      "points for each Yang\nanimal in this row.\nYang animals: rat, tiger,\ndragon, horse, monkey, dog.",
      "points. Can be any\nelement, but not a\nunique element.",
      "points for each Yin\nanimal in this column.\nYin animals: ox, rabbit,\nsnake, goat, chicken, pig.",
      "points for each unique\nelement in this column.",
      "points for each\nadjacent unique element.",
      "points for each Yang\nanimal in this column.\nYang animals: rat, tiger,\ndragon, horse, monkey, dog.",
      "points for each unique\nelement in this row.",
      "points. Can be any\nelement, but not a\nunique element.",
      "points for each\nWood animal.",
      "points for each\nFire animal.",
      "points for each\nEarth animal.",
      "points for each\nMetal animal.",
      "points for each\nWater animal.",
      "points. Can be any\nelement, but not a\nunique element.",
      "points for each\ndiagonally adjacent\nWood animal.",
      "points for each\ndiagonally adjacent\nFire animal.",
      "points for each\ndiagonally adjacent\nEarth animal.",
      "points for each\ndiagonally adjacent\nMetal animal.",
      "points for each\ndiagonally adjacent\nWater animal.",
      "points. Can be any\nelement, but not a\nunique element.",
    ],
  },
  ru: {
    langname: "Русский",
    short: {
      getanimals: "Заведите животных",
      acceeptcards: "Принимать",
      changeelement: "Изменить элемент?",
      changetype: "Изменить тип?",
      clicktoinspect: "Нажмите, чтобы проверить",
      changeeleques: "Сохранить тип и\nизменить элемент?",
      changetypeques: "Сохранить элемент и\nизменить тип?",
      yes: "Да",
      no: "Нет",
      undo: "Отменить",
      ready: "Готовый",
      goback: "Возвращаться",
      watching: "Наблюдая",
      waiting: "Ожидающий...",
      yin: "Инь",
      yang: "Ян",
    },
    carddesc: [
      "очка за каждое животное\nИнь в этом ряду. Животные\nИнь: бык, кролик, змея,\nкоза, курица, свинья.",
      "балла за каждый смежный\nуникальный элемент.",
      "очка за каждого тигра\nи свинью.",
      "балла за каждую собаку\nи кролика.",
      "очка за каждую змею\nи дракона.",
      "балла. Может быть\nлюбым элементом,\nно не уникальным.",
      "очка за каждое животное\nна краю.",
      "очка за каждое животное,\nкоторое находится рядом ровно\nс 2 другими животными.",
      "очка за каждое животное,\nкоторое находится рядом ровно\nс 2 другими животными.",
      "очка за каждого цыплёнка\nи обезьяну.",
      "очка за каждую лошадь\nи козу.",
      "балла. Может быть\nлюбым элементом,\nно не уникальным.",
      "балла за каждое соседнее\nотсутствующее животное.",
      "очка за каждое животное\nна краю.",
      "очка за каждую крысу и быка.",
      "балла за каждое соседнее\nотсутствующее животное.",
      "очка за каждое животное\nЯн в этом ряду. Животные\nЯн: крыса, тигр, дракон,\nлошадь, обезьяна, собака.",
      "балла. Может быть любым\nэлементом, но не уникальным.",
      "балла за каждое животное\nИнь в этом столбце. Животные\nИнь: бык, кролик, змея,\nкоза, курица, свинья.",
      "балла за каждый уникальный\nэлемент в этом столбце.",
      "балла за каждый смежный\nуникальный элемент.",
      "балла за каждое животное\nЯн в этом столбце. Животные\nЯн: крыса, тигр, дракон,\nлошадь, обезьяна, собака.",
      "балла за каждый уникальный\nэлемент в этом ряду.",
      "балла. Может быть любым\nэлементом, но не уникальным.",
      "очка за каждое\nлесное животное.",
      "очка за каждое\nОгненное животное.",
      "очка за каждое\nземное животное.",
      "очка за каждое\nметаллическое животное.",
      "очка за каждое\nводное животное.",
      "балла. Может быть любым\nэлементом, но не уникальным.",
      "очка за каждое диагонально\nсмежное Деревянное животное.",
      "очка за каждое диагонально\nсмежное Огненное животное.",
      "очка за каждое диагонально\nсмежное Земляное животное.",
      "очка за каждое диагонально\nсмежное Металлическое животное.",
      "очка за каждое диагонально\nсмежное Водное животное.",
      "балла. Может быть любым\nэлементом, но не уникальным.",
    ],
  },
}
