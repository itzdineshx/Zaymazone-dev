import { useState } from 'react';
import { Ruler, HelpCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Measurement {
  name: string;
  unit: 'cm' | 'inches';
  description: string;
  howToMeasure: string;
}

interface SizeChartEntry {
  size: string;
  measurements: Record<string, number>;
  bodyType: 'slim' | 'regular' | 'plus';
}

interface SizeGuideData {
  category: 'clothing' | 'jewelry' | 'accessories' | 'home-decor';
  measurements: Measurement[];
  sizeChart: SizeChartEntry[];
  visualGuide?: string;
}

interface SizeGuideProps {
  sizeGuide: SizeGuideData;
  productName: string;
  className?: string;
}

export const SizeGuide = ({ sizeGuide, productName, className = '' }: SizeGuideProps) => {
  const [userMeasurements, setUserMeasurements] = useState<Record<string, number>>({});
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [measurementStep, setMeasurementStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calculateRecommendedSize = () => {
    if (!sizeGuide.sizeChart.length) return;

    let bestMatch = sizeGuide.sizeChart[0];
    let smallestDifference = Infinity;

    sizeGuide.sizeChart.forEach(sizeEntry => {
      let totalDifference = 0;
      let measurementCount = 0;

      sizeGuide.measurements.forEach(measurement => {
        const userValue = userMeasurements[measurement.name];
        const sizeValue = sizeEntry.measurements[measurement.name];

        if (userValue && sizeValue) {
          totalDifference += Math.abs(userValue - sizeValue);
          measurementCount++;
        }
      });

      if (measurementCount > 0) {
        const averageDifference = totalDifference / measurementCount;
        if (averageDifference < smallestDifference) {
          smallestDifference = averageDifference;
          bestMatch = sizeEntry;
        }
      }
    });

    setRecommendedSize(bestMatch.size);
  };

  const handleMeasurementChange = (name: string, value: number) => {
    setUserMeasurements(prev => ({ ...prev, [name]: value }));
  };

  const resetMeasurements = () => {
    setUserMeasurements({});
    setRecommendedSize(null);
    setMeasurementStep(0);
  };

  const nextStep = () => {
    if (measurementStep < sizeGuide.measurements.length - 1) {
      setMeasurementStep(measurementStep + 1);
    } else {
      calculateRecommendedSize();
    }
  };

  const prevStep = () => {
    if (measurementStep > 0) {
      setMeasurementStep(measurementStep - 1);
    }
  };

  if (!sizeGuide || !sizeGuide.measurements.length) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          <Ruler className="h-4 w-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Size Guide for {productName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="interactive" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interactive">Interactive Guide</TabsTrigger>
            <TabsTrigger value="chart">Size Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="interactive" className="space-y-6">
            {/* Measurement Input */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Step {measurementStep + 1} of {sizeGuide.measurements.length}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetMeasurements}
                    className="gap-1"
                  >
                    <X className="h-3 w-3" />
                    Reset
                  </Button>
                </div>
              </div>

              {sizeGuide.measurements[measurementStep] && (
                <MeasurementInput
                  measurement={sizeGuide.measurements[measurementStep]}
                  value={userMeasurements[sizeGuide.measurements[measurementStep].name] || 0}
                  onChange={(value) =>
                    handleMeasurementChange(sizeGuide.measurements[measurementStep].name, value)
                  }
                />
              )}

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((measurementStep + 1) / sizeGuide.measurements.length) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((measurementStep + 1) / sizeGuide.measurements.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={measurementStep === 0}
                >
                  Previous
                </Button>
                <Button onClick={nextStep}>
                  {measurementStep === sizeGuide.measurements.length - 1 ? 'Get Size' : 'Next'}
                </Button>
              </div>
            </div>

            {/* Recommended Size Result */}
            {recommendedSize && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Recommended Size: {recommendedSize}
                  </h3>
                </div>
                <p className="text-green-700 dark:text-green-300">
                  Based on your measurements, we recommend size {recommendedSize}.
                  This is the best fit for your body measurements.
                </p>
              </div>
            )}

            {/* Visual Guide */}
            {sizeGuide.visualGuide && (
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Visual Measurement Guide</h3>
                <img
                  src={sizeGuide.visualGuide}
                  alt="Measurement guide"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="chart" className="space-y-6">
            {/* Size Chart Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left font-semibold">Size</th>
                    {sizeGuide.measurements.map(measurement => (
                      <th key={measurement.name} className="border border-border p-3 text-left font-semibold">
                        {measurement.name} ({measurement.unit})
                      </th>
                    ))}
                    <th className="border border-border p-3 text-left font-semibold">Body Type</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.sizeChart.map(sizeEntry => (
                    <tr key={sizeEntry.size} className="hover:bg-muted/50">
                      <td className="border border-border p-3 font-medium">{sizeEntry.size}</td>
                      {sizeGuide.measurements.map(measurement => (
                        <td key={measurement.name} className="border border-border p-3">
                          {sizeEntry.measurements[measurement.name] || '-'}
                        </td>
                      ))}
                      <td className="border border-border p-3">
                        <Badge variant="outline" className="capitalize">
                          {sizeEntry.bodyType}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measurement Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How to Measure</h3>
              {sizeGuide.measurements.map(measurement => (
                <div key={measurement.name} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">{measurement.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{measurement.description}</p>
                      <p className="text-sm">{measurement.howToMeasure}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Measurement Input Component
interface MeasurementInputProps {
  measurement: Measurement;
  value: number;
  onChange: (value: number) => void;
}

const MeasurementInput = ({ measurement, value, onChange }: MeasurementInputProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">{measurement.name}</h3>
        <p className="text-muted-foreground">{measurement.description}</p>
      </div>

      <div className="flex items-center gap-4 max-w-md mx-auto">
        <Label htmlFor={`measurement-${measurement.name}`} className="text-sm font-medium">
          Enter your {measurement.name.toLowerCase()} ({measurement.unit}):
        </Label>
        <Input
          id={`measurement-${measurement.name}`}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={`0 ${measurement.unit}`}
          className="w-32"
          min="0"
          step="0.1"
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How to measure:</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">{measurement.howToMeasure}</p>
      </div>

      {/* Simple measurement visual */}
      <div className="flex justify-center">
        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
          <Ruler className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
