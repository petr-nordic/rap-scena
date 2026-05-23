import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ContentMetadata } from '../types';
import { ArrowLeft, Calendar, MapPin, Tag, User, Disc } from 'lucide-react';

interface DetailViewProps {
  metadata: ContentMetadata;
  content: string;
  onBack: () => void;
}

export function DetailView({ metadata, content, onBack }: DetailViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Zpět na seznam
      </button>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] uppercase font-bold rounded tracking-wider">
            {metadata.type}
          </span>
          {metadata.publishedAt && (
            <span className="text-zinc-500 text-xs flex items-center gap-1">
              <Calendar size={12} />
              {new Date(metadata.publishedAt).toLocaleDateString('cs-CZ')}
            </span>
          )}
        </div>
        <h1 className="text-5xl font-black text-white mb-6">
          {metadata.title}
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
          {metadata.description}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Informace</h4>
            
            {metadata.type === 'raperi' && (
              <>
                <InfoItem icon={User} label="Občanské jméno" value={metadata.realName} />
                <InfoItem icon={Calendar} label="Narozen" value={metadata.born} />
                <InfoItem icon={Tag} label="Aktivita" value={metadata.active} />
                <InfoItem icon={Tag} label="Label" value={metadata.label} />
              </>
            )}

            {metadata.type === 'alba' && (
              <>
                <InfoItem icon={User} label="Interpret" value={metadata.rapper} />
                <InfoItem icon={Calendar} label="Rok vydání" value={metadata.year.toString()} />
                <InfoItem icon={Tag} label="Label" value={metadata.label} />
              </>
            )}

            {metadata.type === 'labely' && (
              <>
                <InfoItem icon={Calendar} label="Založeno" value={metadata.founded} />
                <InfoItem icon={MapPin} label="Sídlo" value={metadata.location} />
              </>
            )}

            {metadata.type === 'skladby' && (
              <>
                <InfoItem icon={User} label="Interpret" value={metadata.rapper} />
                <InfoItem icon={Disc} label="Album" value={metadata.album} />
                <InfoItem icon={Calendar} label="Rok" value={metadata.year?.toString()} />
              </>
            )}
          </div>
        </aside>

        <article className="lg:col-span-3 prose prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-white prose-blockquote:border-white">
          <div className="markdown-body">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">{label}</p>
      <div className="flex items-center gap-2 text-sm text-zinc-200">
        <Icon size={14} className="text-zinc-500" />
        {value}
      </div>
    </div>
  );
}
