import { Distance } from "./Distance";

export class Distances {
  public swimDistance: Distance;
  public bikeDistance: Distance;
  public runDistance: Distance;

  constructor(swimDistance: number, bikeDistance: number, runDistance: number) {
    this.swimDistance = new Distance(swimDistance);
    this.bikeDistance = new Distance(bikeDistance);
    this.runDistance = new Distance(runDistance);
  }
}
