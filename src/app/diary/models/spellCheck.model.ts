interface SpellCheckResult {
  original: string;
  corrected: string;
  explanation: string;
  isHighlighted: boolean;
}

interface DoneSignal {
  status: 'done';
}

interface ErrorSignal {
  status: 'error';
  message: string;
}
