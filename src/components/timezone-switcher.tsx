import { html } from 'hono/html';

export const defaultTimezone = 'Etc/UTC';

export function TimezoneSwitcher({ timezone }: { timezone: string }) {
  return (
    <p>
      <b>Timezone:</b> {timezone}{' '}
      {timezone === defaultTimezone ? (
        <>
          <a id="switch-timezone" style="display: none">
            Switch to ?
          </a>
          {html`
            <script>
              const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              if (timezone) {
                const a = document.getElementById('switch-timezone');
                a.style.display = 'inline';
                a.innerText = '(➠ ' + timezone + ')';
                a.href = '/?tz=' + timezone;
              }
            </script>
          `}
        </>
      ) : (
        <a href="/">(➠ {defaultTimezone})</a>
      )}
    </p>
  );
}
