import { DateTime } from 'luxon'

export interface Plant {
  id: string;
  name: string;
  areas: Area[];
  machines: Machine[];
}

export interface Machine {
  id: string;
  name: string;
  areas: string[];
}

export interface Area {
  id: string;
  name: string;
  phones: string[];
}

export interface Category {
  id: string;
  name: string;
  severity: string;
}

export interface Report {
  id?: string;
  creation_date: Date | DateTime;
  assist_date: Date | DateTime;
  solved_date: Date | DateTime;
  plant: Plant;
  machine: Machine;
  category: Category;
  area: Area;
  comment: string;

  saved?: boolean;
  sent?: boolean;
}
