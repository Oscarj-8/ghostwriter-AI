import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Play } from "lucide-react";

interface MarketScannerProps {
  triggerAgent: () => void;
  loading: boolean;
}

const MarketScanner = ({ triggerAgent, loading }: MarketScannerProps) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="">
        <Button
          onClick={triggerAgent}
          disabled={loading}
          className="w-full h-12 text-lg font-bold"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Play className="mr-2 fill-current" />
          )}
          SCAN MARKET
        </Button>
      </CardContent>
    </Card>
  );
};

export default MarketScanner;
