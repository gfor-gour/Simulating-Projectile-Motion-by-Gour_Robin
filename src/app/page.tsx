"use client"

import { useEffect, useState } from "react"
import { useSimulation } from "@/hooks/useSimulation"
import Canvas from "@/components/simulation/Canvas"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LiaRocketSolid } from "react-icons/lia";
import { TbRocketOff } from "react-icons/tb";

export default function HomePage() {
  const { simulationState, startSimulation, stopSimulation, updateParams, params } = useSimulation()

  const [startState, setStartState] = useState(false)
  const [formValues, setFormValues] = useState({
    initialVelocity: params.initialVelocity || 20,
    angle: params.angle || 45,
    mass: params.mass || 1,
    airResistance: params.airResistance || false,
    dragCoefficient: params.dragCoefficient || 0.02,
    windSpeed: params.windSpeed || 0,
    windDirection: params.windDirection || 0,
  })

  // Mock results - replace with actual simulation results
  const [results, setResults] = useState({
    timeOfFlight: 2.88,
    maximumHeight: 10.2,
    range: 40.8,
  })

  const handleSliderChange = (name: string, value: number[]) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value[0],
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormValues((prev) => ({
      ...prev,
      airResistance: checked,
    }))
  }

  const handleLaunch = () => {
    updateParams(formValues)
    startSimulation()
    setStartState(true)
  }

  const handleStop = () => {
    stopSimulation()
    setStartState(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        startState ? handleStop() : handleLaunch()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [startState])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="text-center py-8">
        {/* <h1 className="text-4xl font-bold text-white">Simulating Projectile Motion (with Optional Air Resistance)</h1> */}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_200px] gap-6 px-6 pb-6">
        {/* Controls Panel */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Initial Speed */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-white font-medium">Initial speed</label>
                <span className="text-white">{formValues.initialVelocity} m/s</span>
              </div>
              <Slider
                value={[formValues.initialVelocity]}
                onValueChange={(value) => handleSliderChange("initialVelocity", value)}
                max={1000}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Launch Angle */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-white font-medium">Launch angle</label>
                <span className="text-white">{formValues.angle}°</span>
              </div>
              <Slider
                value={[formValues.angle]}
                onValueChange={(value) => handleSliderChange("angle", value)}
                max={90}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Mass */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-white font-medium">Mass</label>
                <span className="text-white">{formValues.mass} kg</span>
              </div>
              <Slider
                value={[formValues.mass]}
                onValueChange={(value) => handleSliderChange("mass", value)}
                max={200}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
            {formValues.airResistance && (
              <>
                {/* Drag Coefficient */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-white font-medium">Drag Coefficient</label>
                    <span className="text-white">{formValues.dragCoefficient}</span>
                  </div>
                  <Slider
                    value={[formValues.dragCoefficient]}
                    onValueChange={(value) => handleSliderChange("dragCoefficient", value)}
                    max={1}
                    min={0.01}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                {/* Wind Speed */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-white font-medium">Wind Speed</label>
                    <span className="text-white">{formValues.windSpeed} m/s</span>
                  </div>
                  <Slider
                    value={[formValues.windSpeed]}
                    onValueChange={(value) => handleSliderChange("windSpeed", value)}
                    max={500}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Wind Direction */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-white font-medium">Wind Direction</label>
                    <span className="text-white">
                      {formValues.windDirection === 0
                        ? "Left to Right (0°)"
                        : "Right to Left (180°)"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={formValues.windDirection === 0 ? "default" : "outline"}
                      className="w-1/2"
                      onClick={() => handleSliderChange("windDirection", [0])}
                    >
                      Left to Right
                    </Button>
                    <Button
                      variant={formValues.windDirection === 180 ? "default" : "outline"}
                      className="w-1/2"
                      onClick={() => handleSliderChange("windDirection", [180])}
                    >
                      Right to Left
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Air Resistance */}
            <div className="flex justify-between items-center">
              <label className="text-white font-medium">Air resistance</label>
              <Switch checked={formValues.airResistance} onCheckedChange={handleSwitchChange} />
            </div>

            {/* Launch Button */}
            <Button
              onClick={startState ? handleStop : handleLaunch}
              className="w-full bg-primary text-white font-semibold py-3 text-lg"
            >
              
               {startState ? <TbRocketOff/> : <LiaRocketSolid/> }
              {startState ? "Stop" : "Launch"}
            </Button>
          </CardContent>
        </Card>

        {/* Simulation Canvas */}
       
          <Canvas simulationState={simulationState} projectileParams={params} missileImageUrl="/torpedo.png" />
    

        {/* Results Panel */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Time of flight</span>
              <span className="text-white font-semibold">{results.timeOfFlight}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Maximum height</span>
              <span className="text-white font-semibold">{results.maximumHeight} m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Range</span>
              <span className="text-white font-semibold">{results.range} m</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
