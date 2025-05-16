"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";

// Define machine data type
type MachineData = {
  machineA: number | null;
  machineB: number | null;
  machineC: number | null;
  machineD: number | null;
  machineE: number | null;
};

type ComputeResponse = {
  status: "success" | "warning";
  message: string;
  currentPower: number;
  currentValue: number;
  isCurrentConfigValid: boolean;
  optimizedValue: number;
  optimizedRuns: Record<string, number>;
};

export default function FactoryPage() {
  const [formData, setFormData] = useState<MachineData>({
    machineA: null,
    machineB: null,
    machineC: null,
    machineD: null,
    machineE: null,
  });

  const [result, setResult] = useState<ComputeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert input to number and ensure it's not negative
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/compute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to compute values");
      }

      const data: ComputeResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Machine Run Frequency</h2>
          <p className="text-sm text-gray-500">
            Enter how many times each machine runs per hour
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {(Object.keys(formData) as Array<keyof MachineData>).map(
              (machine) => (
                <div key={machine} className="space-y-2">
                  <label htmlFor={machine} className="text-sm font-medium">
                    Machine {machine.replace("machine", "")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      id={machine}
                      name={machine}
                      placeholder="0"
                      type="number"
                      min="0"
                      value={formData[machine] ?? ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md bg-white text-black"
                      style={{ backgroundColor: "white" }}
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      times per hour
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="p-6 border-t">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Submit Data"}
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="max-w-lg mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="max-w-lg mx-auto mt-8 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Results</h2>
          </div>
          <div className="p-6">
            <div className="text-lg font-medium text-center mb-4 whitespace-pre-line">
              {result.message}
            </div>

            {result.optimizedRuns && (
              <div className="mt-6">
                <div className="text-sm font-semibold mb-2 text-center">
                  Optimal Configuration (Max Protein: {result.optimizedValue}kg)
                </div>
                <div className="space-y-2 border-t pt-2">
                  {Object.entries(result.optimizedRuns).map(
                    ([machine, runs]) => (
                      <div key={machine} className="flex justify-between">
                        <span>Machine {machine.replace("machine", "")}</span>
                        <span className="font-medium">{runs} runs</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
