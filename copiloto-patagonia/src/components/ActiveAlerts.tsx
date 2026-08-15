import alerts from '../data/alerts.json';
import type { Alert } from '../types';
import WarningBanner from './WarningBanner';

export default function ActiveAlerts() {
  const active = (alerts as Alert[]).filter((a) => a.active);
  if (active.length === 0) return null;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 lg:px-8">
      {active.map((alert) => (
        <WarningBanner key={alert.id} message={alert.message} variant={alert.severity} />
      ))}
    </div>
  );
}
