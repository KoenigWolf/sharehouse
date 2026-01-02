"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import {
  Plus,
  FileText,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle2,
  ListTodo,
  Home,
  BookOpen,
  Bell,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useMeetingNotes,
  MeetingNoteFormSheet,
} from "@/src/features/meetings";
import { useLanguage } from "@/src/shared/lang/context";
import { cn } from "@/src/lib/utils";

export default function MeetingArchivePage() {
  const { lang } = useLanguage();
  const { notes, loading, error, refetch } = useMeetingNotes();
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCreate = () => {
    setFormMode("create");
    setEditingId(undefined);
  };

  const handleEdit = (id: string) => {
    setFormMode("edit");
    setEditingId(id);
  };

  const handleFormClose = () => {
    setFormMode(null);
    setEditingId(undefined);
  };

  const selectedNote = notes.find((n) => n.id === selectedId);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <SimpleHeader />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Meeting Archive
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Monthly resident meeting notes and decisions
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FileText className="w-4 h-4" />}
            label="Total Notes"
            value={notes.length}
          />
          <StatCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Decisions"
            value={notes.reduce((sum, n) => sum + n.decisions.length, 0)}
          />
          <StatCard
            icon={<ListTodo className="w-4 h-4" />}
            label="Action Items"
            value={notes.reduce((sum, n) => sum + n.actionItems.length, 0)}
          />
          <StatCard
            icon={<Calendar className="w-4 h-4" />}
            label="Latest"
            value={notes[0]?.date ? format(new Date(notes[0].date), "MM/dd") : "—"}
          />
        </div>

        {loading && (
          <div className="text-sm text-zinc-500">Loading...</div>
        )}

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-4 py-3">
            Error: {error.message}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
            {/* List */}
            <div className="space-y-3">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    selectedId === note.id && "ring-2 ring-zinc-900 dark:ring-zinc-50"
                  )}
                  onClick={() => setSelectedId(note.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs">
                        {format(new Date(note.date), "yyyy/MM/dd")}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(note.id);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {note.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {note.decisions.length} decisions
                      </span>
                      <span className="flex items-center gap-1">
                        <ListTodo className="w-3 h-3" />
                        {note.actionItems.length} actions
                      </span>
                      {note.attendees.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {note.attendees.length}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="hidden lg:block">
              {selectedNote ? (
                <Card className="sticky top-8">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit font-mono text-xs">
                      {format(new Date(selectedNote.date), "yyyy/MM/dd")}
                    </Badge>
                    <CardTitle>{selectedNote.title}</CardTitle>
                    <CardDescription>{selectedNote.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedNote.decisions.length > 0 && (
                      <Section title="Decisions" items={selectedNote.decisions} />
                    )}
                    {selectedNote.actionItems.length > 0 && (
                      <Section title="Action Items" items={selectedNote.actionItems} />
                    )}
                    {selectedNote.attendees.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Attendees</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedNote.attendees.map((name) => (
                            <Badge key={name} variant="secondary" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedNote.content && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Notes</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                          {selectedNote.content}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="sticky top-8">
                  <CardContent className="py-12 text-center text-zinc-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a note to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
        </div>
      </main>

      <SimpleFooter />

      <MeetingNoteFormSheet
        mode={formMode || "create"}
        noteId={editingId}
        isOpen={formMode !== null}
        onClose={handleFormClose}
        onSuccess={refetch}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
            {icon}
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-zinc-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/members", label: "Members", icon: Users },
  { href: "/meetings/archive", label: "Meetings", icon: FileText },
  { href: "/house-rules", label: "Rules", icon: BookOpen },
  { href: "/notices", label: "Notices", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

function SimpleHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-semibold text-zinc-900 dark:text-zinc-50">
            ShareHouse
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <nav className="sm:hidden flex items-center gap-2">
            {navItems.slice(0, 4).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function SimpleFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            ShareHouse Resident Portal
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/house-rules" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Rules
            </Link>
            <Link href="/settings" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
