import { AgentLogProps } from './agent-log';
import { Button } from './ui/button';
import { Loader2, Trash2, Zap } from 'lucide-react';

interface AgentLogButtonsProps {
  handleApprove: () => void;
  isSending: boolean;
  setLogs: (logs: AgentLogProps  | null) => void;
}

const AgentLogButtons = (
  { handleApprove, isSending, setLogs }: AgentLogButtonsProps
) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={handleApprove}
        disabled={isSending}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-12"
      >
        {isSending ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          <Zap className="w-4 h-4 mr-2" />
        )}
        APPROVE AND SEND NOW
      </Button>

      <Button
        onClick={() => setLogs(null)}
        variant="outline"
        className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 h-12"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        DISCARD
      </Button>
    </div>
  );
}

export default AgentLogButtons