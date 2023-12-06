export function Indicator({ result }: { result: string }) {
  return <span>{{ success: '🟩', failure: '🟥' }[result] ?? '❓'}</span>;
}
