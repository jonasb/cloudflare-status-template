import type { RowType } from 'd1-sql-tag';
import type { selectLatestLogLines } from '../db/database-statements';
import { formatDateTime } from '../utils/date-display';

export function LogLines({
  logLines,
  timezone,
}: {
  logLines: RowType<typeof selectLatestLogLines>[];
  timezone: string;
}) {
  if (logLines.length === 0) {
    return <></>;
  }
  return (
    <>
      <h2>Recent logs</h2>
      <div class="full-bleed-scroll-container">
        <table class="table">
          <tbody>
            {logLines.map((logLine) => {
              return (
                <tr>
                  <td>{formatDateTime(logLine.createdAt, timezone)}</td>
                  <td>{logLine.level}</td>
                  <td>{logLine.message}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
