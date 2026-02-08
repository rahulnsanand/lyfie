import { useState } from "react";
import ProfileCard from '@features/dashboard/cards/ProfileCard/ProfileCard';
import Default from '@features/dashboard/cards/DefaultCard/DefaultCard';
import MoodCard, {
  MoodId,
  MOOD_THEME,
} from "@features/dashboard/cards/MoodCard/MoodCard";
import './Dashboard.css';
import GlassCard, { EnergyStyle } from '@shared/components/GlassEnergyCard/GlassCard';
import Expense from "@features/dashboard/cards/ExpenseCard/ExpenseCard";
import JournalCard from "@features/dashboard/cards/JournalCard/JournalCard";

type GridSize = {
  col: number;
  row: number;
};

type GridZone = 'primary' | 'secondary' | 'tertiary';

interface WidgetItem {
  id: string;
  title: string;
  size: GridSize;
  zone: GridZone;
  visible?: boolean;
  color: string;
  styleType: EnergyStyle;
  Component: React.ComponentType<any>;
}

const WIDGET_DATA: WidgetItem[] = [
  {
    id: 'stat',
    title: 'stat',
    size: { col: 1, row: 1 },
    zone: 'primary',
    color: 'var(--color-bg-profile-dark)',
    styleType: 'dual-pulse',
    Component: Default,
  },
  {
    id: 'journdal',
    title: 'journal',
    size: { col: 1, row: 1 },
    zone: 'primary',
    color: 'var(--color-bg-profile-dark)',
    styleType: 'dual-pulse',
    Component: Default,
  },
  {
    id: 'mood',
    title: 'Today I feel',
    size: { col: 1, row: 1 },
    zone: 'primary',
    color: 'var(--color-bg-profile-dark)',
    styleType: 'dual-pulse',
    Component: MoodCard,
  },
  {
    id: 'ai',
    title: 'AI Insights',
    size: { col: 3, row: 3 },
    zone: 'secondary',
    color: 'var(--color-bg-profile-dark)',
    styleType: 'fluid-waves',
    Component: Default,
  },
  {
    id: 'profile',
    title: '',
    size: { col: 3, row: 2 },
    zone: 'secondary',
    color: 'var(--color-bg-profile-dark)',
    styleType: 'dual-pulse',
    Component: ProfileCard,
  },
  {
    id: 'habits',
    title: 'Habit Tracker',
    size: { col: 3, row: 3 },
    zone: 'primary',
    color: 'var(--color-bg-habits-dark)',
    styleType: 'fluid-waves',
    Component: Default,
  },
  {
    id: 'expenses',
    title: 'Expense Summary',
    size: { col: 3, row: 2 },
    zone: 'primary',
    visible: true,
    color: 'var(--color-bg-expense-dark)',
    styleType: 'fluid-waves',
    Component: Expense,
  },
  {
    id: 'journal',
    title: 'My Journal',
    size: { col: 3, row: 2 },
    zone: 'secondary',
    visible: true,
    color: 'var(--color-bg-goals-dark)',
    styleType: 'fluid-waves',
    Component: JournalCard,
  },
  {
    id: 'events',
    title: 'Upcoming Events',
    size: { col: 3, row: 2 },
    zone: 'tertiary',
    visible: true,
    color: 'var(--color-bg-goals-dark)',
    styleType: 'fluid-waves',
    Component: Default,
  },
  {
    id: 'bucketlist',
    title: 'My Bucket List',
    size: { col: 3, row: 2 },
    zone: 'tertiary',
    visible: true,
    color: 'var(--color-bg-expense-dark)',
    styleType: 'fluid-waves',
    Component: Default,
  },
];

export default function Dashboard() {
  const [currentMood, setCurrentMood] = useState<MoodId>("unset");
  const moodTheme = MOOD_THEME[currentMood];

  return (
    <main className="dashboard-container">
      <div className="bento-grid-12">
        {WIDGET_DATA
          .filter(w => w.visible !== false)
          .map(widget => {
            const isMoodCard = widget.id === "mood";

            return (
              <GlassCard
                key={widget.id}
                accent={isMoodCard ? moodTheme.color : widget.color}
                energy={isMoodCard ? moodTheme.energy : widget.styleType}
                className={`col-${widget.size.col} row-${widget.size.row}`}
              >
                {widget.title && (
                  <header className="item-header">{widget.title}</header>
                )}

                <widget.Component
                  onMoodChange={isMoodCard ? setCurrentMood : undefined}
                />
              </GlassCard>
            );
          })}
      </div>
    </main>
  );
}