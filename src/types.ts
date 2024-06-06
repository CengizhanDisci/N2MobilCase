export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface UserWithUniqueId extends User {
  uniqueId: string;
}

export interface PostWithUniqueId extends Post {
  uniqueId: string;
}

export interface TaskWithUniqueId extends Task {
  uniqueId: string;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  PhotoDetail: { photos: Photo[] };
  Profile: undefined;
};
