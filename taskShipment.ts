type Point = string;
type Trip = [Point, Point];

interface Shipment {
  pickups: Point[];
  drops: Point[];
}

const validateTrips = (shipment: Shipment, trips: Trip[]): boolean => {
  const { pickups, drops } = shipment;
  
  const pickupSet = new Set(pickups);
  const dropSet = new Set(drops);
  const allPoints = new Set([...pickups, ...drops]);

  const tripMap = new Map<Point, Point[]>();

  for (const [start, end] of trips) {
    if (!tripMap.has(start)) {
      tripMap.set(start, []);
    }
    tripMap.get(start)!.push(end);
    allPoints.add(start);
    allPoints.add(end);
  }

  for (const pickup of pickups) {
    if (!tripMap.has(pickup)) {
      return false;
    }
  }

  const visited = new Set<Point>();
  const stack = [...pickups];

  while (stack.length) {
    const point = stack.pop()!;
    if (visited.has(point)) {
      continue;
    }
    visited.add(point);
    const nextPoints = tripMap.get(point) || [];
    for (const nextPoint of nextPoints) {
      stack.push(nextPoint);
    }
  }

  for (const drop of drops) {
    if (!visited.has(drop)) {
      return false;
    }
  }

  return true;
};

const shipment: Shipment = { pickups: ['A', 'B'], drops: ['C', 'D'] };
const validTrips: Trip[] = [
  ['A', 'W'], ['B', 'W'], ['W', 'C'], ['W', 'D']
];
const invalidTrips: Trip[] = [
  ['A', 'W1'], ['B', 'W2'], ['W3', 'C'], ['W4', 'D']
];

console.log(validateTrips(shipment, validTrips)); // true
console.log(validateTrips(shipment, invalidTrips)); // false
