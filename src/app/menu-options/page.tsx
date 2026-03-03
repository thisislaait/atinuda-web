'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { Sparkles, Ticket } from 'lucide-react';
import { DINNER_BLOCKS, type CourseBlock, type CourseChoice } from '@/lib/menu-dinner-data';
import styles from './page.module.css';

type SelectionState = {
  belombre: { starter: string; main: string; dessert: string };
  labourdonnais: { starter: string; main: string; dessert: string };
};

type ModalState = {
  dinnerId: string;
  course: CourseBlock;
  choice: CourseChoice;
} | null;

const DEFAULT_EVENT_SLUG = process.env.NEXT_PUBLIC_DEFAULT_EVENT_SLUG || 'martitus-retreat-2026';

const DEFAULT_SELECTIONS: SelectionState = {
  belombre: { starter: '', main: '', dessert: '' },
  labourdonnais: { starter: '', main: '', dessert: '' },
};

export default function MenuOptionsPage() {
  const [eventSlug, setEventSlug] = useState(DEFAULT_EVENT_SLUG);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [activeDinnerId, setActiveDinnerId] = useState(DINNER_BLOCKS[0]?.id ?? '');
  const [submitState, setSubmitState] = useState<{ loading: boolean; message: string; ok: boolean }>({
    loading: false,
    message: '',
    ok: false,
  });
  const [modalState, setModalState] = useState<ModalState>(null);
  const [selections, setSelections] = useState<SelectionState>(DEFAULT_SELECTIONS);

  const activeBlock = useMemo(
    () => DINNER_BLOCKS.find((block) => block.id === activeDinnerId) ?? DINNER_BLOCKS[0],
    [activeDinnerId],
  );

  const requiredCourses = useMemo(() => DINNER_BLOCKS.flatMap((block) => block.courses), []);

  const canSubmitIdentity = useMemo(
    () => firstName.trim().length > 0 && lastName.trim().length > 0 && eventSlug.trim().length > 0,
    [eventSlug, firstName, lastName],
  );

  const isComplete = useMemo(
    () =>
      requiredCourses.every((course) => {
        const selected = selections[course.venue][course.courseKey];
        return Boolean(selected && selected.trim().length > 0);
      }),
    [requiredCourses, selections],
  );

  const selectedCount = useMemo(
    () =>
      requiredCourses.reduce(
        (count, course) =>
          count + (selections[course.venue][course.courseKey].trim().length > 0 ? 1 : 0),
        0,
      ),
    [requiredCourses, selections],
  );

  const toggleSelection = (course: CourseBlock, choice: CourseChoice) => {
    setSelections((prev) => {
      const current = prev[course.venue][course.courseKey];
      const nextValue = current === choice.title ? '' : choice.title;
      return {
        ...prev,
        [course.venue]: {
          ...prev[course.venue],
          [course.courseKey]: nextValue,
        },
      };
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmitIdentity) {
      setSubmitState({ loading: false, ok: false, message: 'Enter first name, last name, and event slug.' });
      return;
    }

    if (!isComplete) {
      setSubmitState({ loading: false, ok: false, message: 'Complete all starter, main, and dessert selections first.' });
      return;
    }

    setSubmitState({ loading: true, ok: false, message: '' });

    const res = await fetch('/api/menu-options/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventSlug,
        firstName,
        lastName,
        profile: null,
        belombre: {
          starter: selections.belombre.starter,
          main: selections.belombre.main,
          dessert: selections.belombre.dessert,
        },
        labourdonnais: {
          starter: selections.labourdonnais.starter,
          main: selections.labourdonnais.main,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSubmitState({ loading: false, ok: false, message: data?.error || 'Could not save menu options.' });
      return;
    }

    setSubmitState({
      loading: false,
      ok: true,
      message: `Saved menu choices successfully (${data.entryId}).`,
    });
  };

  return (
    <main className={styles.page}>
      <section className="relative flex min-h-[90vh] items-end overflow-hidden px-6 pb-16 pt-36 md:pb-24">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Chewton-Glen.jpg"
            alt="Retreat setting"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(13,11,10,0.82)_5%,rgba(13,11,10,0.45)_55%,rgba(13,11,10,0.7)_100%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#ede7dd]">
            Atinuda Retreat 2026
          </p>
          <h1 className="hero-text max-w-4xl text-4xl leading-[1.05] text-[#f4efe5] md:text-6xl lg:text-7xl">
            Dinner Menu Selection
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#e7ded0] md:text-lg">
            Choose your courses for Day 3 and Day 6 dinners, then submit once.
          </p>
        </div>
      </section>

      <div className={styles.shell}>
        <section className={styles.card}>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label>Event</label>
              <input
                value={eventSlug}
                onChange={(e) => setEventSlug(e.target.value)}
                placeholder="martitus-retreat-2026"
              />
            </div>
            <div className={styles.field}>
              <label>First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
            </div>
            <div className={styles.field}>
              <label>Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
            </div>
          </div>
        </section>

        <div className={styles.tabBar}>
          {DINNER_BLOCKS.map((block) => {
            const active = block.id === activeBlock.id;
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => setActiveDinnerId(block.id)}
                className={`${styles.tabBtn} ${active ? styles.tabBtnActive : ''}`}
              >
                {block.tabTitle}
              </button>
            );
          })}
        </div>

        <section className={styles.card}>
          <div className={styles.metaHeader}>
            <p className={styles.metaKicker}>Dinner Event</p>
            <h3 className={styles.metaTitle}>{activeBlock.heading}</h3>
            <p className={styles.metaSub}>{activeBlock.whenWhere}</p>
            {activeBlock.intro ? <p className={styles.metaIntro}>{activeBlock.intro}</p> : null}
          </div>

          {activeBlock.arrivalExperience ? (
            <div className={styles.arrivalCard}>
              <div className={styles.arrivalHeadingRow}>
                <Sparkles size={16} strokeWidth={2.1} className={styles.arrivalIcon} />
                <p className={styles.arrivalTitle}>{activeBlock.arrivalExperience.title}</p>
              </div>
              <div className={styles.arrivalWrap}>
                {activeBlock.arrivalExperience.snacks.map((snack) => (
                  <span key={snack} className={styles.arrivalChip}>
                    <Ticket size={12} strokeWidth={2.1} />
                    {snack}
                  </span>
                ))}
              </div>
              {activeBlock.arrivalExperience.bar ? (
                <p className={styles.arrivalBar}>{activeBlock.arrivalExperience.bar}</p>
              ) : null}
            </div>
          ) : null}

          {activeBlock.courses.map((course) => {
            const selectedValue = selections[course.venue][course.courseKey];

            return (
              <section key={course.id} className={styles.courseSection}>
                <h4 className={styles.courseTitle}>{course.title}</h4>
                {course.note ? <p className={styles.courseNote}>{course.note}</p> : null}
                <p className={styles.courseSelected}>
                  {selectedValue ? `Selected: ${selectedValue}` : 'Not selected'}
                </p>

                <div className={styles.cardsGrid}>
                  {course.choices.map((choice) => {
                    const selected = selectedValue === choice.title;
                    return (
                      <article
                        key={choice.optionId}
                        className={`${styles.choiceCard} ${selected ? styles.choiceCardSelected : ''}`}
                      >
                        <button
                          type="button"
                          className={styles.imageButton}
                          onClick={() => setModalState({ dinnerId: activeBlock.id, course, choice })}
                        >
                          <div className={styles.imageWrap}>
                            <Image
                              src={choice.image}
                              alt={choice.title}
                              fill
                              className={styles.image}
                              sizes="(max-width: 860px) 100vw, 48vw"
                            />
                          </div>
                        </button>

                        <div className={styles.choiceBody}>
                          <p className={styles.choiceTitle}>{choice.title}</p>
                          {choice.teaser ? <p className={styles.choiceTeaser}>{choice.teaser}</p> : null}
                          <div className={styles.choiceActions}>
                            <button
                              type="button"
                              className={styles.ghostBtn}
                              onClick={() => setModalState({ dinnerId: activeBlock.id, course, choice })}
                            >
                              See details
                            </button>
                            <button
                              type="button"
                              className={`${styles.selectBtn} ${selected ? styles.selectBtnActive : ''}`}
                              onClick={() => toggleSelection(course, choice)}
                            >
                              {selected ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {activeBlock.staticNotes?.length ? (
            <div className={styles.staticNotes}>
              {activeBlock.staticNotes.map((note) => (
                <p key={note}>• {note}</p>
              ))}
            </div>
          ) : null}
        </section>

        <form className={styles.card} onSubmit={onSubmit}>
          <h2 className={styles.sectionTitle}>Submit Menu Choices</h2>
          <p className={styles.subtleProgress}>
            Completed {selectedCount} of {requiredCourses.length} required selections.
          </p>
          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primary} disabled={submitState.loading || !isComplete}>
              {submitState.loading ? 'Saving...' : 'Save Menu Selections'}
            </button>
            {submitState.message ? (
              <span className={submitState.ok ? styles.success : styles.err}>{submitState.message}</span>
            ) : null}
          </div>
        </form>
      </div>

      {modalState ? (
        <MealDetailModal
          modalState={modalState}
          selected={selections[modalState.course.venue][modalState.course.courseKey] === modalState.choice.title}
          onClose={() => setModalState(null)}
          onToggleSelection={() => toggleSelection(modalState.course, modalState.choice)}
        />
      ) : null}
    </main>
  );
}

function MealDetailModal({
  modalState,
  selected,
  onClose,
  onToggleSelection,
}: {
  modalState: Exclude<ModalState, null>;
  selected: boolean;
  onClose: () => void;
  onToggleSelection: () => void;
}) {
  const { course, choice } = modalState;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalImageWrap}>
          <Image src={choice.image} alt={choice.title} fill className={styles.image} sizes="90vw" />
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalKicker}>{course.title}</p>
          <h3 className={styles.modalTitle}>{choice.title}</h3>
          {choice.teaser ? <p className={styles.modalTeaser}>{choice.teaser}</p> : null}

          <div className={styles.modalSection}>
            <h4>Key ingredients</h4>
            {choice.profile.madeWith.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </div>

          <div className={styles.modalSection}>
            <h4>Taste profile</h4>
            <p>{choice.profile.tasteProfile}</p>
          </div>

          <div className={styles.modalSection}>
            <h4>Avoid if allergic to</h4>
            {choice.profile.allergyCaution.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </div>

          {choice.profile.bestExperiencedWith ? (
            <div className={styles.modalSection}>
              <h4>Best experienced with</h4>
              <p>{choice.profile.bestExperiencedWith}</p>
            </div>
          ) : null}

          {choice.profile.bestFor ? (
            <div className={styles.modalSection}>
              <h4>Best for</h4>
              <p>{choice.profile.bestFor}</p>
            </div>
          ) : null}

          <div className={styles.modalActions}>
            <button type="button" className={styles.ghostBtn} onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className={`${styles.selectBtn} ${selected ? styles.selectBtnActive : ''}`}
              onClick={onToggleSelection}
            >
              {selected ? 'Tap to unselect' : 'Select this dish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
