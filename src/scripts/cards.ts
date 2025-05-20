import { Collection } from "../logic"

export type Animal =
  | "RAT"
  | "OX"
  | "TIGER"
  | "RABBIT"
  | "DRAGON"
  | "SNAKE"
  | "HORSE"
  | "GOAT"
  | "MONKEY"
  | "CHICKEN"
  | "DOG"
  | "PIG"

export type Ele = "WOOD" | "FIRE" | "EARTH" | "METAL" | "WATER" | "FLUX"

export interface Ability {
  num: number
  where: "SELF" | "ALL" | "DIA" | "ADJ" | "ROW" | "COL"
  // condition
  con: {
    force?: "YIN" | "YANG"
    ele?: Ele
    animals?: [Animal, Animal]
    special?: "EMPTY" | "UNIQUEELE" | "DOUBLEADJ" | "EDGE" | "FLUX"
  }
}

export interface Card {
  id: number
  animal: Animal
  ele: Ele
  isYin: boolean
  ability: Ability
}

const CARDS_TABLE: Card[] = [
  {
    id: 0,
    animal: "RAT",
    ele: "WOOD",
    isYin: false,
    ability: {
      num: 4,
      where: "ROW",
      con: {
        force: "YIN",
      },
    },
  },
  {
    id: 1,
    animal: "OX",
    ele: "FIRE",
    isYin: true,
    ability: {
      num: 4,
      where: "ADJ",
      con: {
        special: "UNIQUEELE",
      },
    },
  },
  {
    id: 2,
    animal: "TIGER",
    ele: "EARTH",
    isYin: false,
    ability: {
      num: 3,
      where: "ALL",
      con: {
        animals: ["TIGER", "PIG"],
      },
    },
  },
  {
    id: 3,
    animal: "RABBIT",
    ele: "METAL",
    isYin: true,
    ability: {
      num: 3,
      where: "ALL",
      con: {
        animals: ["DOG", "RABBIT"],
      },
    },
  },
  {
    id: 4,
    animal: "DRAGON",
    ele: "WATER",
    isYin: false,
    ability: {
      num: 3,
      where: "ALL",
      con: {
        animals: ["SNAKE", "DRAGON"],
      },
    },
  },
  {
    id: 5,
    animal: "SNAKE",
    ele: "FLUX",
    isYin: true,
    ability: {
      num: 5,
      where: "SELF",
      con: {
        special: "FLUX",
      },
    },
  },
  {
    id: 6,
    animal: "PIG",
    ele: "WOOD",
    isYin: true,
    ability: {
      num: 2,
      where: "ALL",
      con: {
        special: "EDGE",
      },
    },
  },
  {
    id: 7,
    animal: "DOG",
    ele: "FIRE",
    isYin: false,
    ability: {
      num: 3,
      where: "ALL",
      con: {
        special: "DOUBLEADJ",
      },
    },
  },
  {
    id: 8,
    animal: "CHICKEN",
    ele: "EARTH",
    isYin: true,
    ability: {
      num: 3,
      where: "ALL",
      con: {
        special: "DOUBLEADJ",
      },
    },
  },
  {
    id: 9,
    animal: "MONKEY",
    ele: "METAL",
    isYin: false,
    ability: {
      num: 3,
      where: "ALL",
      con: {
        animals: ["CHICKEN", "MONKEY"],
      },
    },
  },
  {
    id: 10,
    animal: "GOAT",
    ele: "WATER",
    isYin: true,
    ability: {
      num: 3,
      where: "ALL",
      con: {
        animals: ["HORSE", "GOAT"],
      },
    },
  },
  {
    id: 11,
    animal: "HORSE",
    ele: "FLUX",
    isYin: false,
    ability: {
      num: 5,
      where: "SELF",
      con: {
        special: "FLUX",
      },
    },
  },
  {
    id: 12,
    animal: "SNAKE",
    ele: "WOOD",
    isYin: true,
    ability: {
      num: 3,
      where: "ADJ",
      con: {
        special: "EMPTY",
      },
    },
  },
  {
    id: 13,
    animal: "RAT",
    ele: "FIRE",
    isYin: false,
    ability: {
      num: 2,
      where: "ALL",
      con: {
        special: "EDGE",
      },
    },
  },
  {
    id: 14,
    animal: "OX",
    ele: "EARTH",
    isYin: true,
    ability: {
      num: 3,
      where: "ALL",
      con: {
        animals: ["RAT", "OX"],
      },
    },
  },
  {
    id: 15,
    animal: "TIGER",
    ele: "METAL",
    isYin: false,
    ability: {
      num: 3,
      where: "ADJ",
      con: {
        special: "EMPTY",
      },
    },
  },
  {
    id: 16,
    animal: "RABBIT",
    ele: "WATER",
    isYin: true,
    ability: {
      num: 4,
      where: "ROW",
      con: {
        force: "YANG",
      },
    },
  },
  {
    id: 17,
    animal: "DRAGON",
    ele: "FLUX",
    isYin: false,
    ability: {
      num: 5,
      where: "SELF",
      con: {
        special: "FLUX",
      },
    },
  },
  {
    id: 18,
    animal: "HORSE",
    ele: "WOOD",
    isYin: false,
    ability: {
      num: 4,
      where: "COL",
      con: {
        force: "YIN",
      },
    },
  },
  {
    id: 19,
    animal: "PIG",
    ele: "FIRE",
    isYin: true,
    ability: {
      num: 3,
      where: "COL",
      con: {
        special: "UNIQUEELE",
      },
    },
  },
  {
    id: 20,
    animal: "DOG",
    ele: "EARTH",
    isYin: false,
    ability: {
      num: 4,
      where: "ADJ",
      con: {
        special: "UNIQUEELE",
      },
    },
  },
  {
    id: 21,
    animal: "CHICKEN",
    ele: "METAL",
    isYin: true,
    ability: {
      num: 4,
      where: "COL",
      con: {
        force: "YANG",
      },
    },
  },
  {
    id: 22,
    animal: "MONKEY",
    ele: "WATER",
    isYin: false,
    ability: {
      num: 3,
      where: "ROW",
      con: {
        special: "UNIQUEELE",
      },
    },
  },
  {
    id: 23,
    animal: "GOAT",
    ele: "FLUX",
    isYin: true,
    ability: {
      num: 5,
      where: "SELF",
      con: {
        special: "FLUX",
      },
    },
  },
  {
    id: 24,
    animal: "DRAGON",
    ele: "WOOD",
    isYin: false,
    ability: {
      num: 2,
      where: "ALL",
      con: {
        ele: "WOOD",
      },
    },
  },
  {
    id: 25,
    animal: "SNAKE",
    ele: "FIRE",
    isYin: true,
    ability: {
      num: 2,
      where: "ALL",
      con: {
        ele: "FIRE",
      },
    },
  },
  {
    id: 26,
    animal: "RAT",
    ele: "EARTH",
    isYin: false,
    ability: {
      num: 2,
      where: "ALL",
      con: {
        ele: "EARTH",
      },
    },
  },
  {
    id: 27,
    animal: "OX",
    ele: "METAL",
    isYin: true,
    ability: {
      num: 2,
      where: "ALL",
      con: {
        ele: "METAL",
      },
    },
  },
  {
    id: 28,
    animal: "TIGER",
    ele: "WATER",
    isYin: false,
    ability: {
      num: 2,
      where: "ALL",
      con: {
        ele: "WATER",
      },
    },
  },
  {
    id: 29,
    animal: "RABBIT",
    ele: "FLUX",
    isYin: true,
    ability: {
      num: 5,
      where: "SELF",
      con: {
        special: "FLUX",
      },
    },
  },
  {
    id: 30,
    animal: "GOAT",
    ele: "WOOD",
    isYin: true,
    ability: {
      num: 4,
      where: "DIA",
      con: {
        ele: "WOOD",
      },
    },
  },
  {
    id: 31,
    animal: "HORSE",
    ele: "FIRE",
    isYin: false,
    ability: {
      num: 4,
      where: "DIA",
      con: {
        ele: "FIRE",
      },
    },
  },
  {
    id: 32,
    animal: "PIG",
    ele: "EARTH",
    isYin: true,
    ability: {
      num: 4,
      where: "DIA",
      con: {
        ele: "EARTH",
      },
    },
  },
  {
    id: 33,
    animal: "DOG",
    ele: "METAL",
    isYin: false,
    ability: {
      num: 4,
      where: "DIA",
      con: {
        ele: "METAL",
      },
    },
  },
  {
    id: 34,
    animal: "CHICKEN",
    ele: "WATER",
    isYin: true,
    ability: {
      num: 4,
      where: "DIA",
      con: {
        ele: "WATER",
      },
    },
  },
  {
    id: 35,
    animal: "MONKEY",
    ele: "FLUX",
    isYin: false,
    ability: {
      num: 5,
      where: "SELF",
      con: {
        special: "FLUX",
      },
    },
  },
]

export default CARDS_TABLE

type EA = (collection: Collection, targetPosition: [number, number]) => number
export const evaluateAbility: EA = (collection, targetPosition) => {
  //// handle each ability type
  //// pay attention for edge type
  return 123
}
