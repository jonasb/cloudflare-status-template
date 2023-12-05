export const defaultTimezone = 'Etc/UTC';

export function TimezoneSwitcher({ timezone }: { timezone: string }) {
  return (
    <p>
      Timezone: {timezone}{' '}
      {timezone === defaultTimezone ? (
        <>
          <a id="switch-timezone" style="display: none">
            Switch to ?
          </a>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezone) {
              const a = document.getElementById("switch-timezone");
              a.style.display = "inline";
              a.innerText = "(➠ " + timezone + ")";
              a.href = "/?tz=" + timezone;
            }`,
            }}
          />
        </>
      ) : (
        <a href="/">(➠ {defaultTimezone})</a>
      )}
    </p>
  );
}
