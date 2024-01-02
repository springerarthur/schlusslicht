export class Distances {
  public swimDistance: number = 0;
  public bikeDistance: number = 0;
  public runDistance: number = 0;

  constructor(swimDistance: number, bikeDistance: number, runDistance: number) {
    this.swimDistance = swimDistance;
    this.bikeDistance = bikeDistance;
    this.runDistance = runDistance;
  }

  public getFormattedSwimDistance(): string {
    return this.formatDistance(this.swimDistance);
  }

  public getFormattedBikeDistance(): string {
    return this.formatDistance(this.bikeDistance);
  }

  public getFormattedRunDistance(): string {
    return this.formatDistance(this.runDistance);
  }

  private formatDistance(distance: number): string {
    const roundedDistance = Math.round(distance * 100) / 100;

    const formattedDistance = roundedDistance.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formattedDistance;
  }
}
