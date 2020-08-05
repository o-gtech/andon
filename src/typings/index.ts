export interface Plant {
  id: string;
  name: string;
  areas: Area[];
  machines: Machine[];
}

// const emptyPlant: Plant = {
//   id: '',
//   name: '',
//   areas: [],
//   machines: []
// }

export interface Machine {
  id: string;
  name: string;
  areas: string[];
}

// const emptyMachine: Machine = {
//   id: '',
//   name: '',
//   areas: []
// }

export interface Area {
  id: string;
  name: string;
  phones: string[];
}

// const emptyArea: Area = {
//   id: '',
//   name: '',
//   phones: []
// }

export interface Category {
  id: string;
  name: string;
  severity: string;
}

// const emptyCategory: Category = {
//   id: '',
//   name: '',
//   severity: ''
// }

export interface Report {
  id?: string;
  creation_date: Date;
  assist_date: Date;
  solved_date: Date;
  plant: Plant;
  machine: Machine;
  category: Category;
  area: Area;
  comment: string;
}

// const emptyReport: Report = {
//   creation_date: new Date(),
//   assist_date: new Date(),
//   solved_date: new Date(),
//   plant: emptyPlant,
//   machine: emptyMachine,
//   category: emptyCategory,
//   area: emptyArea,
//   comment: ''
// }
