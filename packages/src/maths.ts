// This function isn't used anywhere, so
// Rollup excludes it from the bundle...
const PI = 3.14;

export function square(x: number): number {
  return x * x;
}

// This function gets included
export function cube(x: number): number {
  return x * x * x * PI;
}
