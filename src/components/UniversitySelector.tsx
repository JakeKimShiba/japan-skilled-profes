import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useI18n } from '@/i18n';

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
  const [options, setOptions] = useState<Option[]>([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<Option[]>([]);

  useEffect(() => {
    // Build a path that respects Vite's base URL (works for GitHub Pages and dev)
    const csvPath = `${import.meta.env.BASE_URL}resources/universities_english.csv`;

    const load = async () => {
      try {
        const r = await fetch(csvPath);
        if (!r.ok) throw new Error(`Failed to load ${csvPath}`);
        const text = await r.text();
        const rows = text.split(/\r?\n/).map(r => r.trim()).filter(r => r && !r.startsWith('#'));
        const opts = rows.map(r => {
          const parts = r.split(',');
          const name = (parts[0] || '').trim();
          const country = (parts[1] || '').trim();
          const eligible = true; // All entries treated as eligible
          return { name, country, eligible } as Option;
        }).filter(o => o.name);
        setOptions(opts);
        setFiltered(opts);
      } catch (e) {
        // Fallback to a relative path (in case BASE_URL handling differs)
        try {
          const r2 = await fetch('resources/universities_english.csv');
          if (!r2.ok) throw new Error('fallback fetch failed');
          const text2 = await r2.text();
          const rows2 = text2.split(/\r?\n/).map(r => r.trim()).filter(r => r && !r.startsWith('#'));
          const opts2 = rows2.map(r => {
            const parts = r.split(',');
            const name = (parts[0] || '').trim();
            const country = (parts[1] || '').trim();
            return { name, country, eligible: true } as Option;
          }).filter(o => o.name);
          setOptions(opts2);
          setFiltered(opts2);
        } catch {
          setOptions([]);
          setFiltered([]);
        }
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!query) return setFiltered(options);
    const q = query.toLowerCase();
    setFiltered(options.filter(o => o.name.toLowerCase().includes(q) || (o.country || '').toLowerCase().includes(q)));
  }, [query, options]);

  return (
    <div>
      <input
        className="w-full input input-bordered"
        placeholder={t('university.search.placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-2 max-h-56 overflow-auto border rounded">
        {filtered.length === 0 && <div className="p-2 text-sm text-muted-foreground">{t('university.noResults')}</div>}
        {filtered.map((o) => (
          <button
            key={o.name}
            type="button"
            className="w-full text-left p-2 hover:bg-muted flex items-center justify-between"
            onClick={() => onSelect(o)}
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
                <input
                  type="radio"
                  name="university-select"
                  checked={selectedName === o.name}
                  readOnly
                  aria-label={t('university.selectAria', { name: o.name })}
                />
              </div>
             </div>
           </button>
         ))}
       </div>
     </div>
   );
 }
