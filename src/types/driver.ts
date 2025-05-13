import { Cars } from "./fleet"

export interface Drivers {
    id: number,
    name: string,
    email: string,
    phone: string,
    licenceNumber:string,
    carId: string,
    status: "active"| "inactive",
    type:"internal"| "external",
    rating: number,
    completedTrips:number
    photo?: string,
    car:Cars[]

}

       