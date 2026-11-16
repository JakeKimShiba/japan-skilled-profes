import { useEffect, useId, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useI18n } from '@/i18n';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Option { name: string; country?: string; eligible: boolean; }

const countryEmojiMap: Record<string, string> = {
  // Two-letter ISO codes
  'jp': '🇯🇵',
  'kr': '🇰🇷',
  'us': '🇺🇸',
  'cn': '🇨🇳',
  'tw': '🇹🇼',
  'sg': '🇸🇬',
  'au': '🇦🇺',
  'ca': '🇨🇦',
  'de': '🇩🇪',
  'nl': '🇳🇱',
  'se': '🇸🇪',
  'mx': '🇲🇽',
  'fr': '🇫🇷',
  'be': '🇧🇪',
  'at': '🇦🇹',
  'sa': '🇸🇦',
  'ae': '🇦🇪',
  'ru': '🇷🇺',
  'hk': '🇭🇰',
  'in': '🇮🇳',
  'es': '🇪🇸',
  'japan': '🇯🇵',
  'united states of america': '🇺🇸',
  'united states': '🇺🇸',
  'republic of korea': '🇰🇷',
  'south korea': '🇰🇷',
  'korea': '🇰🇷',
  'china': '🇨🇳',
  'people\'s republic of china': '🇨🇳',
  'united kingdom': '🇬🇧',
  'uk': '🇬🇧',
  'canada': '🇨🇦',
  'australia': '🇦🇺',
  'germany': '🇩🇪',
  'netherlands': '🇳🇱',
  'sweden': '🇸🇪',
  'singapore': '🇸🇬',
  'taiwan': '🇹🇼',
  'mexico': '🇲🇽',
  'france': '🇫🇷',
  'belgium': '🇧🇪',
  'austria': '🇦🇹',
  'saudi arabia': '🇸🇦',
  'united arab emirates': '🇦🇪',
  'russian federation': '🇷🇺',
  'hong kong': '🇭🇰',
  'india': '🇮🇳',
  'spain': '🇪🇸'
};

const countryCodeMap: Record<string, string> = {
  'jp': 'JP', 'japan': 'JP',
  'kr': 'KR', 'korea': 'KR', 'south korea': 'KR', 'republic of korea': 'KR',
  'us': 'US', 'united states': 'US', 'united states of america': 'US',
  'cn': 'CN', 'china': 'CN', 'people\'s republic of china': 'CN',
  'tw': 'TW', 'taiwan': 'TW',
  'sg': 'SG', 'singapore': 'SG',
  'au': 'AU', 'australia': 'AU',
  'ca': 'CA', 'canada': 'CA',
  'de': 'DE', 'germany': 'DE',
  'nl': 'NL', 'netherlands': 'NL',
  'se': 'SE', 'sweden': 'SE',
  'mx': 'MX', 'mexico': 'MX',
  'fr': 'FR', 'france': 'FR',
  'be': 'BE', 'belgium': 'BE',
  'at': 'AT', 'austria': 'AT',
  'sa': 'SA', 'saudi arabia': 'SA',
  'ae': 'AE', 'united arab emirates': 'AE',
  'ru': 'RU', 'russian federation': 'RU',
  'hk': 'HK', 'hong kong': 'HK',
  'in': 'IN', 'india': 'IN',
  'es': 'ES', 'spain': 'ES',
  'uk': 'GB', 'united kingdom': 'GB'
};

function countryToEmoji(country?: string) {
  if (!country) return '';
  const key = country.trim().toLowerCase();
  return countryEmojiMap[key] || '';
}

function countryToCode(country?: string) {
  if (!country) return '';
  const key = country.trim().toLowerCase();
  return countryCodeMap[key] || (key.length === 2 ? key.toUpperCase() : '');
}

export default function UniversitySelector({ onSelect, selectedName }: { onSelect: (opt: Option | null) => void; selectedName?: string }) {
  const { t } = useI18n();
  const id = useId();
  const [options, setOptions] = useState<Option[]>([]);
  const [query, setQuery] = useState('');
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const csvPath = `${import.meta.env.BASE_URL}resources/universities_english.csv`;
    setLoadStatus('loading');

    const load = async () => {
      for (const url of new Set([csvPath, 'resources/universities_english.csv'])) {
        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error('University list unavailable');
          const text = await response.text();
          if (text.trimStart().startsWith('<')) throw new Error('Expected university CSV, not HTML');
          const rows = text.split(/\r?\n/).map(row => row.trim()).filter(row => row && !row.startsWith('#'));
          const loaded = rows.map(row => {
            const parts = row.split(',');
            const name = (parts[0] || '').trim();
            const country = (parts[1] || '').trim();
            return { name, country, eligible: true } as Option;
          }).filter(option => option.name);
          if (!loaded.length) throw new Error('Empty university list');
          if (controller.signal.aborted) return;
          setOptions(loaded);
          setLoadStatus('ready');
          return;
        } catch {
          if (controller.signal.aborted) return;
        }
      }
      setOptions([]);
      setLoadStatus('error');
    };

    void load();
    return () => controller.abort();
  }, [loadAttempt]);

  const q = query.toLowerCase();
  const filtered = options.filter(option => option.name.toLowerCase().includes(q) || (option.country || '').toLowerCase().includes(q));
  return (
    <div>
      <Label htmlFor={`${id}-search`} className="mb-2">{t('university.search.label')}</Label>
      <Input
        id={`${id}-search`}
        placeholder={t('university.search.placeholder')}
        aria-describedby={`${id}-help`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p id={`${id}-help`} className="mt-2 text-xs text-muted-foreground">{t('university.keyboardHelp')}</p>
      <div className="mt-2 max-h-56 overflow-auto border rounded" aria-busy={loadStatus === 'loading'}>
        {loadStatus === 'loading' && <div role="status" className="p-2 text-sm text-muted-foreground">{t('university.loading')}</div>}
        {loadStatus === 'error' && (
          <div role="alert" className="p-2 space-y-2 text-sm">
            <p>{t('university.loadError')}</p>
            <button type="button" className="underline text-primary" onClick={() => setLoadAttempt(attempt => attempt + 1)}>
              {t('university.retry')}
            </button>
          </div>
        )}
        {loadStatus === 'ready' && filtered.length === 0 && <div className="p-2 text-sm text-muted-foreground">{t('university.noResults')}</div>}
        {loadStatus === 'ready' && filtered.length > 0 && (
          <RadioGroup
            aria-label={t('university.search.label')}
            aria-describedby={`${id}-help`}
            value={selectedName || ''}
            onValueChange={name => onSelect(options.find(option => option.name === name) || null)}
            className="gap-0"
          >
        {filtered.map((o, index) => (
          <Label
            key={o.name}
            htmlFor={`${id}-${index}`}
            className="w-full min-w-0 text-left p-2 hover:bg-muted focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3 w-full">
              {/* Flag column */}
              <div className="w-10 flex-shrink-0 flex items-center justify-center text-lg">
                {(() => {
                  const code = countryToCode(o.country);
                  if (code) {
                    return (
                      <ReactCountryFlag
                        countryCode={code}
                        svg
                        style={{ width: 28, height: 20 }}
                        title={o.country}
                      />
                    );
                  }
                  return <span aria-hidden>{countryToEmoji(o.country)}</span>;
                })()}
              </div>

              {/* Name and country (stacked) */}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate" title={o.name}>{o.name}</div>
                <div className="text-xs text-muted-foreground truncate" title={o.country}>{(o.country || '').trim().length > 3 ? o.country : ''}</div>
              </div>

              {/* Small radio column for selection affordance */}
              <div className="ml-4 flex-shrink-0">
                <RadioGroupItem
                  id={`${id}-${index}`}
                  value={o.name}
                  aria-label={t('university.selectAria', { name: o.name })}
                />
              </div>
             </div>
           </Label>
         ))}
          </RadioGroup>
        )}
       </div>
     </div>
   );
 }
