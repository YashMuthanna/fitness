"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";

// Define machine data type
type MachineData = {
  machineA: number;
  machineB: number;
  machineC: number;
  machineD: number;
  machineE: number;
};

export default function FactoryPage() {
  const [formData, setFormData] = useState<MachineData>({
    machineA: 0,
    machineB: 0,
    machineC: 0,
    machineD: 0,
    machineE: 0,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert input to number and ensure it's not negative
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitted data:", formData);
    setSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold">Not Implemented!</h1>
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
                      type="number"
                      min="0"
                      value={formData[machine]}
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

      {submitted && (
        <div className="max-w-lg mx-auto mt-8 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Submitted Data</h2>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {/* {(Object.entries(formData) as [keyof MachineData, number][]).map(
                ([machine, runs]) => (
                  <div
                    key={machine}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>Machine {machine.replace("machine", "")}</span>
                    <span className="font-semibold">{runs} times per hour</span>
                  </div>
                )
              )} */}
              <div className="flex justify-between items-center pt-2 font-bold">
                <span>Total Runs</span>
                {/* <span>{compute(formData)} times per hour</span> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
