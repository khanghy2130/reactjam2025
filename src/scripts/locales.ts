export type Language = "en"
/// | "es" | "pt" | "ru"

export type Translation = {
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
  }
  carddesc: string[]
}

export const translations: Record<Language, Translation> = {
  en: {
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
    },
    carddesc: [
      "0: dummy desc\ntext long text an text long\n line 3",
      "1: dummy desc\ntext long text an text long\n line 3",
      "2: dummy desc\ntext long text an text long\n line 3",
      "3: dummy desc\ntext long text an text long\n line 3",
      "4: dummy desc\ntext long text an text long\n line 3",
      "5: dummy desc\ntext long text an text long\n line 3",
      "6: dummy desc\ntext long text an text long\n line 3",
      "7: dummy desc\ntext long text an text long\n line 3",
      "8: dummy desc\ntext long text an text long\n line 3",
      "9: dummy desc\ntext long text an text long\n line 3",
      "10: dummy desc\ntext long text an text long\n line 3",
      "11: dummy desc\ntext long text an text long\n line 3",
      "12: dummy desc\ntext long text an text long\n line 3",
      "13: dummy desc\ntext long text an text long\n line 3",
      "14: dummy desc\ntext long text an text long\n line 3",
      "15: dummy desc\ntext long text an text long\n line 3",
      "16: dummy desc\ntext long text an text long\n line 3",
      "17: dummy desc\ntext long text an text long\n line 3",
      "18: dummy desc\ntext long text an text long\n line 3",
      "19: dummy desc\ntext long text an text long\n line 3",
      "20: dummy desc\ntext long text an text long\n line 3",
      "21: dummy desc\ntext long text an text long\n line 3",
      "22: dummy desc\ntext long text an text long\n line 3",
      "23: dummy desc\ntext long text an text long\n line 3",
      "24: dummy desc\ntext long text an text long\n line 3",
      "25: dummy desc\ntext long text an text long\n line 3",
      "26: dummy desc\ntext long text an text long\n line 3",
      "27: dummy desc\ntext long text an text long\n line 3",
      "28: dummy desc\ntext long text an text long\n line 3",
      "29: dummy desc\ntext long text an text long\n line 3",
      "30: dummy desc\ntext long text an text long\n line 3",
      "31: dummy desc\ntext long text an text long\n line 3",
      "32: dummy desc\ntext long text an text long\n line 3",
      "33: dummy desc\ntext long text an text long\n line 3",
      "34: dummy desc\ntext long text an text long\n line 3",
      "35: dummy desc\ntext long text an text long\n line 3",
    ],
  },
}
