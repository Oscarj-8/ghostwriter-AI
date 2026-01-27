import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Play } from "lucide-react";

interface MarketScannerProps {
  triggerAgent: () => void;
  loading: boolean;
}

const MarketScanner = ({ triggerAgent, loading }: MarketScannerProps) => {
  return (
    <Card className="border-2 border-black">
      <CardContent className="pt-6">
        <Button
          onClick={triggerAgent}
          disabled={loading}
          className="w-full h-16 text-lg font-bold"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Play className="mr-2 fill-current" />
          )}
          TRIGGER MORNING MARKET SCAN
        </Button>
      </CardContent>
    </Card>
  );
};

export default MarketScanner;
