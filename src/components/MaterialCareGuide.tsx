import { useState } from 'react';
import {
  Droplets,
  Wind,
  Shirt,
  Package,
  AlertTriangle,
  Play,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CareInstructions {
  materials: string[];
  washing: {
    method?: string;
    temperature?: string;
    detergent?: string;
    specialNotes?: string;
  };
  drying: {
    method?: string;
    temperature?: string;
    specialNotes?: string;
  };
  ironing: {
    temperature?: string;
    method?: string;
    specialNotes?: string;
  };
  storage?: string;
  cleaning?: string;
  warnings?: string[];
  icons?: string[];
  videoTutorial?: string;
}

interface MaterialCareGuideProps {
  careInstructions: CareInstructions;
  compact?: boolean;
  className?: string;
}

export const MaterialCareGuide = ({
  careInstructions,
  compact = false,
  className = ''
}: MaterialCareGuideProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showVideo, setShowVideo] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const careSymbols = {
    washing: {
      machine: { icon: '🧺', label: 'Machine Wash' },
      hand: { icon: '👐', label: 'Hand Wash Only' },
      'dry-clean': { icon: '👔', label: 'Dry Clean' },
      'no-wash': { icon: '🚫🧺', label: 'Do Not Wash' }
    },
    drying: {
      tumble: { icon: '💨', label: 'Tumble Dry' },
      'air-dry': { icon: '🌬️', label: 'Air Dry' },
      'dry-flat': { icon: '📏', label: 'Dry Flat' },
      'no-dry': { icon: '🚫💨', label: 'Do Not Tumble Dry' }
    },
    ironing: {
      hot: { icon: '🔥', label: 'Hot Iron' },
      medium: { icon: '🌡️', label: 'Medium Iron' },
      cold: { icon: '❄️', label: 'Cold Iron' },
      'no-iron': { icon: '🚫🔥', label: 'Do Not Iron' }
    }
  };

  const CareSection = ({
    title,
    icon: Icon,
    content,
    sectionKey
  }: {
    title: string;
    icon: any;
    content: React.ReactNode;
    sectionKey: string;
  }) => {
    const isExpanded = expandedSections[sectionKey];

    if (compact) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium">{title}:</span>
          <span className="text-muted-foreground">{content}</span>
        </div>
      );
    }

    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto hover:bg-muted/50"
            onClick={() => toggleSection(sectionKey)}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{title}</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <div className="text-muted-foreground">
            {content}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  if (!careInstructions) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Care Instructions</h3>
        </div>

        {careInstructions.videoTutorial && (
          <Dialog open={showVideo} onOpenChange={setShowVideo}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Play className="h-4 w-4" />
                Watch Tutorial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Care Instructions Video</DialogTitle>
              </DialogHeader>
              <div className="aspect-video">
                <video
                  src={careInstructions.videoTutorial}
                  controls
                  className="w-full h-full rounded-lg"
                  poster="/api/placeholder/800/450"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Materials */}
      {careInstructions.materials && careInstructions.materials.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {careInstructions.materials.map((material, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              <Package className="h-3 w-3" />
              {material}
            </Badge>
          ))}
        </div>
      )}

      {/* Care Instructions */}
      <div className="space-y-2">
        {/* Washing */}
        {(careInstructions.washing?.method || careInstructions.washing?.temperature) && (
          <CareSection
            title="Washing"
            icon={Droplets}
            sectionKey="washing"
            content={
              <div className="space-y-2">
                {careInstructions.washing.method && (
                  <p><strong>Method:</strong> {careInstructions.washing.method}</p>
                )}
                {careInstructions.washing.temperature && (
                  <p><strong>Temperature:</strong> {careInstructions.washing.temperature}</p>
                )}
                {careInstructions.washing.detergent && (
                  <p><strong>Detergent:</strong> {careInstructions.washing.detergent}</p>
                )}
                {careInstructions.washing.specialNotes && (
                  <p><strong>Notes:</strong> {careInstructions.washing.specialNotes}</p>
                )}
              </div>
            }
          />
        )}

        {/* Drying */}
        {(careInstructions.drying?.method || careInstructions.drying?.temperature) && (
          <CareSection
            title="Drying"
            icon={Wind}
            sectionKey="drying"
            content={
              <div className="space-y-2">
                {careInstructions.drying.method && (
                  <p><strong>Method:</strong> {careInstructions.drying.method}</p>
                )}
                {careInstructions.drying.temperature && (
                  <p><strong>Temperature:</strong> {careInstructions.drying.temperature}</p>
                )}
                {careInstructions.drying.specialNotes && (
                  <p><strong>Notes:</strong> {careInstructions.drying.specialNotes}</p>
                )}
              </div>
            }
          />
        )}

        {/* Ironing */}
        {(careInstructions.ironing?.temperature || careInstructions.ironing?.method) && (
          <CareSection
            title="Ironing"
            icon={Shirt}
            sectionKey="ironing"
            content={
              <div className="space-y-2">
                {careInstructions.ironing.temperature && (
                  <p><strong>Temperature:</strong> {careInstructions.ironing.temperature}</p>
                )}
                {careInstructions.ironing.method && (
                  <p><strong>Method:</strong> {careInstructions.ironing.method}</p>
                )}
                {careInstructions.ironing.specialNotes && (
                  <p><strong>Notes:</strong> {careInstructions.ironing.specialNotes}</p>
                )}
              </div>
            }
          />
        )}

        {/* Storage */}
        {careInstructions.storage && (
          <CareSection
            title="Storage"
            icon={Package}
            sectionKey="storage"
            content={<p>{careInstructions.storage}</p>}
          />
        )}

        {/* Cleaning */}
        {careInstructions.cleaning && (
          <CareSection
            title="Cleaning"
            icon={Droplets}
            sectionKey="cleaning"
            content={<p>{careInstructions.cleaning}</p>}
          />
        )}
      </div>

      {/* Care Symbols */}
      {careInstructions.icons && careInstructions.icons.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Care Symbols</h4>
          <div className="flex flex-wrap gap-3">
            {careInstructions.icons.map((iconUrl, index) => (
              <img
                key={index}
                src={iconUrl}
                alt={`Care symbol ${index + 1}`}
                className="w-8 h-8 object-contain"
              />
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {careInstructions.warnings && careInstructions.warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important Warnings</h4>
          </div>
          <ul className="space-y-1">
            {careInstructions.warnings.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Care Legend */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
        <p className="font-medium mb-2">Care Legend:</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <span>🧺</span>
            <span>Machine wash</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👐</span>
            <span>Hand wash</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💨</span>
            <span>Tumble dry</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌬️</span>
            <span>Air dry</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔥</span>
            <span>Hot iron</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚫</span>
            <span>Do not</span>
          </div>
        </div>
      </div>
    </div>
  );
};
