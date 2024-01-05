
export class Distance {
  public distance: number = 0;

  constructor(distance: number) {
    this.distance = distance;
  }

  valueOf(): number {
    return this.distance;
  }

  toString(): string {
    const roundedDistance = Math.round(this.distance * 100) / 100;

    const formattedDistance = roundedDistance.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formattedDistance;
  }
}
