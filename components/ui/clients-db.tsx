
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldCheck,} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientsDBProps {
  sellers: string
  setSellers: React.Dispatch<React.SetStateAction<string>>
  buyers: string
  setBuyers: React.Dispatch<React.SetStateAction<string>>
  saveLists: () => void
}
const ClientsDB = ({
  sellers,
  setSellers,
  buyers,
  setBuyers,
  saveLists
}: ClientsDBProps) => {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" /> Client Database
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base">Sellers (Emails)</Label>
          <p className="text-sm text-muted-foreground">
            Enter list of sellers emails separated by commas
          </p>
          <Textarea
            value={sellers}
            onChange={(e) => setSellers(e.target.value)}
            placeholder="email1@test.com, email2@test.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-base">Buyers (Emails)</Label>
          <p className="text-sm text-muted-foreground">
            Enter list of buyers emails separated by commas
          </p>
          <Textarea
            value={buyers}
            onChange={(e) => setBuyers(e.target.value)}
            placeholder="email3@test.com, email4@test.com"
            className="mt-1"
          />
        </div>
        <Button onClick={saveLists} variant="default" className="w-full">
          Save
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientsDB