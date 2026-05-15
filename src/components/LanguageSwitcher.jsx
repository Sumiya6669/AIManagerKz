import { Languages } from 'lucide-react';
import { useI18n } from '@/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher({ compact = false }) {
  const { language, languages, setLanguage, t } = useI18n();
  const current = languages.find((item) => item.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/70 bg-white px-3 text-xs font-bold text-foreground shadow-sm transition hover:bg-secondary"
          aria-label={t('common.language')}
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          {compact ? current.label : current.name}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((item) => (
          <DropdownMenuItem key={item.code} onClick={() => setLanguage(item.code)}>
            <span className={item.code === language ? 'font-black text-primary' : ''}>{item.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
