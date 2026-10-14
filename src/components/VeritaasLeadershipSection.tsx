import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight } from 'lucide-react';
import { LEADERSHIP_PROFILES, LeaderProfile } from '../data/gabsData';
import {
  RevealOnScroll,
  ScrollTextReveal,
  TiltCutawayCard,
} from './InteractiveEffects';

interface VeritaasLeadershipSectionProps {
  isDark: boolean;
}

export const VeritaasLeadershipSection: React.FC<
  VeritaasLeadershipSectionProps
> = ({ isDark }) => {
  const [activeGroup, setActiveGroup] = useState<'board' | 'management'>(
    'board'
  );
  const [selectedLeader, setSelectedLeader] = useState<LeaderProfile | null>(
    null
  );

  const boardCount = LEADERSHIP_PROFILES.filter(
    (p) => p.group === 'board'
  ).length;
  const managementCount = LEADERSHIP_PROFILES.filter(
    (p) => p.group === 'management'
  ).length;

  const filteredProfiles = LEADERSHIP_PROFILES.filter(
    (profile) => profile.group === activeGroup
  );

  return (
    <section
      id="leadership"
      className={`transition-colors duration-300 border-b border-current/10 ${
        isDark ? 'bg-[#0A0F18] text-[#F8FAFC]' : 'bg-[#F6F6F2] text-[#0B1320]'
      }`}
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        {/* Header + Interactive Segmented Filter Control */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full bg-[#00B876]"
              />
              <span className="text-crest-ui font-semibold opacity-75">
                Corporate Governance &amp; Executive Stewardship
              </span>
            </div>
            <ScrollTextReveal
              text="Guided by seasoned institutional leaders."
              highlightWords={['seasoned', 'institutional', 'leaders.']}
              className="font-display font-bold text-crest-h2"
            />
          </div>

          {/* Interactive Filter Controls (14px-15px UI Labels & Navigation) */}
          <div
            role="tablist"
            aria-label="Leadership Category Filter"
            className={`inline-flex items-center gap-1.5 p-1.5 rounded-xl border self-start lg:self-auto ${
              isDark
                ? 'bg-[#111927] border-white/10'
                : 'bg-[#E9E9E2] border-black/10'
            }`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeGroup === 'board'}
              onClick={() => setActiveGroup('board')}
              className={`px-4 py-2.5 rounded-lg text-crest-ui font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeGroup === 'board'
                  ? 'bg-[#0D51B2] text-white shadow-sm'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              Board of Directors ({boardCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeGroup === 'management'}
              onClick={() => setActiveGroup('management')}
              className={`px-4 py-2.5 rounded-lg text-crest-ui font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeGroup === 'management'
                  ? 'bg-[#00B876] text-[#060B14] shadow-sm'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              Management Team ({managementCount})
            </button>
          </div>
        </RevealOnScroll>

        {/* Profiles Grid with Official Portrait Photos & Staggered IO Reveal */}
        <div
          key={activeGroup}
          className={`grid grid-cols-1 md:grid-cols-2 ${
            activeGroup === 'board' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          } gap-6 sm:gap-8`}
        >
          {filteredProfiles.map((person, index) => (
            <TiltCutawayCard
              key={person.id}
              delayMs={index * 90}
              onClick={() => setSelectedLeader(person)}
              className={`rounded-2xl border overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-xl ${
                isDark
                  ? 'border-white/10 bg-[#111927] hover:border-[#00B876]/50'
                  : 'border-black/10 bg-white hover:border-[#0D51B2]/50'
              }`}
            >
              <div>
                {/* Executive Portrait Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <img
                    src={person.imageUrl}
                    alt={`${person.name} — ${person.role}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80"
                  />
                  <span
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/45 backdrop-blur-md text-white font-display font-bold text-crest-caption flex items-center justify-center tabular-nums border border-white/15"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    0{index + 1}
                  </span>
                </div>

                {/* Card Copy Content */}
                <div className="p-6 space-y-3">
                  {/* People's Name in Bricolage Grotesque (H3: 24px-32px) */}
                  <div className="space-y-1">
                    <h3
                      className="font-display font-bold text-crest-h3 group-hover:text-[#0D51B2] dark:group-hover:text-[#00B876] transition-colors"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {person.name}
                    </h3>
                    <p className="text-crest-ui font-semibold text-[#00B876]">
                      {person.role}
                    </p>
                    {person.credentials && (
                      <p className="text-crest-caption opacity-60 pt-0.5">
                        {person.credentials}
                      </p>
                    )}
                  </div>

                  <p className="text-crest-body opacity-80 line-clamp-3">
                    {person.shortBio}
                  </p>
                </div>
              </div>

              {/* Unboxed metadata separator list (12px Caption) + Read Full Dossier action */}
              <div className="px-6 pb-6 pt-4 border-t border-current/10 space-y-3">
                <div className="text-crest-caption opacity-65 truncate">
                  {person.specialties.join(' · ')}
                </div>
                <div className="flex items-center justify-between text-crest-ui font-semibold text-[#0D51B2] dark:text-[#00B876]">
                  <span>Read Full Executive Profile</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </TiltCutawayCard>
          ))}
        </div>
      </div>

      {/* Executive Bio Modal Drawer with Portrait */}
      <AnimatePresence>
        {selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLeader(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-3xl rounded-2xl border p-6 sm:p-9 max-h-[90vh] overflow-y-auto ${
                isDark
                  ? 'bg-[#0E1624] border-white/15 text-white'
                  : 'bg-white border-black/15 text-[#0B1320]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-current/10">
                <div className="flex items-center gap-5">
                  <img
                    src={selectedLeader.imageUrl}
                    alt={selectedLeader.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover object-top border border-current/10 shrink-0"
                  />
                  <div>
                    <span className="text-crest-caption font-semibold text-[#00B876] block mb-1">
                      {selectedLeader.group === 'board'
                        ? 'Board of Directors'
                        : 'Executive Management Team'}
                    </span>
                    <h3
                      className="font-display font-bold text-crest-h3"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {selectedLeader.name}
                    </h3>
                    <p className="text-crest-ui font-semibold opacity-80 mt-1">
                      {selectedLeader.role}
                    </p>
                    {selectedLeader.credentials && (
                      <p className="text-crest-caption opacity-60 mt-0.5">
                        {selectedLeader.credentials}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLeader(null)}
                  aria-label="Close biography modal"
                  className="w-10 h-10 rounded-full border border-current/15 flex items-center justify-center hover:bg-current/5 transition-colors cursor-pointer shrink-0 self-end sm:self-start"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                {selectedLeader.fullBio.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-crest-body opacity-85">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-current/10 flex flex-wrap items-center justify-between gap-4 text-crest-caption opacity-75">
                <span>
                  Areas of Oversight: {selectedLeader.specialties.join(' · ')}
                </span>
                <span className="font-semibold text-[#00B876]">
                  GABS Financial Services Limited
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
