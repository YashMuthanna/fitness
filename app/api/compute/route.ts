import { NextResponse } from "next/server";

// Define machine data type
type MachineData = {
  machineA: number | null;
  machineB: number | null;
  machineC: number | null;
  machineD: number | null;
  machineE: number | null;
};

// function algo(
//   weights: number[],
//   values: number[],
//   counts: number[],
//   capacity: number
// ) {
//   const n = weights.length;

//   const dp = Array(capacity + 1).fill(0);

//   for (let i = 0; i < n; i++) {
//     const weight = weights[i];
//     const value = values[i];
//     const count = counts[i];

//     // Create a temporary array to avoid counting the same item multiple times
//     const tempDp = [...dp];

//     for (let j = weight; j <= capacity; j++) {
//       for (let k = 1; k <= count; k++) {
//         // Check if we can use k instances of this item
//         if (j >= k * weight) {
//           dp[j] = Math.max(dp[j], tempDp[j - k * weight] + k * value);
//         } else {
//           break;
//         }
//       }
//     }
//   }

//   return dp[capacity];
// }

export async function POST(request: Request) {
  try {
    const formData: MachineData = await request.json();
    const MAX_POWER = 50; // 50kW maximum

    const machineData = {
      machineA: { weight: 10, power: 2, runs: 0 },
      machineB: { weight: 20, power: 5, runs: 0 },
      machineC: { weight: 35, power: 10, runs: 0 },
      machineD: { weight: 50, power: 15, runs: 0 },
      machineE: { weight: 100, power: 40, runs: 0 },
    };

    Object.entries(formData).forEach(([machine, runs]) => {
      const machineKey = machine as keyof MachineData;
      machineData[machineKey].runs = runs || 0; // Handle null values
    });

    let totalPower = 0;
    let totalValue = 0;
    Object.entries(machineData).forEach(([machine, data]) => {
      totalPower += data.power * data.runs;
      totalValue += data.weight * data.runs;
    });

    const weights: number[] = [];
    const values: number[] = [];
    const counts: number[] = [];
    const machineNames: string[] = [];

    Object.entries(machineData).forEach(([machine, data]) => {
      weights.push(data.power);
      values.push(data.weight);
      counts.push(data.runs);
      machineNames.push(machine);
    });

    // const maxProtein = algo(weights, values, counts, MAX_POWER);

    // Always calculate the optimal solution
    const optimizedResult = optimizeKnapsack(
      MAX_POWER,
      weights,
      values,
      counts,
      machineNames
    );

    const isCurrentConfigValid = totalPower <= MAX_POWER;
    const status = isCurrentConfigValid ? "success" : "warning";
    const emoji = isCurrentConfigValid ? "✅" : "⚠️";
    const message = `${emoji} Current Power: ${totalPower}kW, Current Protein: ${totalValue}kg\nOptimal Solution Available: ${optimizedResult.maxValue}kg`;

    return NextResponse.json({
      status,
      message,
      currentPower: totalPower,
      currentValue: totalValue,
      isCurrentConfigValid,
      optimizedValue: optimizedResult.maxValue,
      optimizedRuns: optimizedResult.optimalRuns,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to compute values" },
      { status: 500 }
    );
  }
}

function optimizeKnapsack(
  capacity: number,
  weights: number[],
  values: number[],
  counts: number[],
  machineNames: string[]
) {
  const n = weights.length;
  const W = capacity;

  // dp[i][w] = max value using items[0..i-1] with capacity w
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  // To track the optimal solution
  const choices = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1];
    const val = values[i - 1];
    const cnt = counts[i - 1];

    for (let w = 0; w <= W; w++) {
      // Start with taking 0 of item i
      let best = dp[i - 1][w];
      let bestK = 0;

      // Try taking k copies, up to cnt and fitting in w
      for (let k = 1; k <= cnt && k * wt <= w; k++) {
        const candidate = dp[i - 1][w - k * wt] + k * val;
        if (candidate > best) {
          best = candidate;
          bestK = k;
        }
      }

      dp[i][w] = best;
      choices[i][w] = bestK;
    }
  }

  // Recover the solution
  const optimalRuns: Record<string, number> = {};
  machineNames.forEach((name) => (optimalRuns[name] = 0));

  let remainingW = W;
  for (let i = n; i > 0; i--) {
    const k = choices[i][remainingW];
    if (k > 0) {
      optimalRuns[machineNames[i - 1]] = k;
      remainingW -= k * weights[i - 1];
    }
  }

  return {
    maxValue: dp[n][W],
    optimalRuns,
  };
}
