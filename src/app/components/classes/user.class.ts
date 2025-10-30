// encapsulates user data (name, weight, height, bmi, etc)
// has methods like calculateBmi(), etc.
// this is Object-Oriented Programming (OOP) style: reusable

export class User {
  constructor(
    public name: string,
    public password: string,
    public dob: string = '',
    public bloodPressure: string = '',
    public weight: number = 0,
    public height: number = 0,
    public bmi: number = 0
  ) {}

  calculateBmi(): number {
    if (!this.weight || !this.height) return NaN;

    const hMeters = this.height > 3 ? this.height / 100 : this.height;
    const value = this.weight / (hMeters * hMeters);
    this.bmi = Math.round(value * 10) / 10;
    return this.bmi;
  }

  getBmiCategory(): string {
    const v = this.bmi || this.calculateBmi();
    if (!isFinite(v)) return '';
    if (v < 18.5) return 'Underweight';
    if (v < 25) return 'Healthy weight';
    if (v < 30) return 'Overweight';
    if (v < 35) return 'Obesity (Class 1)';
    if (v < 40) return 'Obesity (Class 2)';
    return 'Obesity (Class 3)';
  }

  getBmiColor(): string {
    switch (this.getBmiCategory()) {
      case 'Underweight':
        return 'text-info';
      case 'Healthy weight':
        return 'text-success';
      case 'Overweight':
        return 'text-warning';
      case 'Obesity (Class 1)':
        return 'text-orange';
      case 'Obesity (Class 2)':
      case 'Obesity (Class 3)':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }

  validateCredentials(): boolean {
    return !!this.name && !!this.password;
  }
}
