"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { DemoStore, KanbanStage } from "../../constants/demoStores";
import {
  DEMO_STORES,
  KANBAN_STAGE_LABELS,
} from "../../constants/demoStores";
import { DemoBadge } from "../ui/DemoBadge";
import { cn } from "@/utils/cn";

const STAGES: KanbanStage[] = [
  "need_evidence",
  "evidence_uploaded",
  "pending_google",
  "done",
];

function KanbanCard({
  store,
  onSelect,
}: {
  store: DemoStore;
  onSelect: (store: DemoStore) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: store.id,
    data: { store },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(store)}
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md",
        isDragging && "opacity-50",
      )}
    >
      <p className="text-sm font-medium text-slate-800">{store.name}</p>
      <p className="mt-1 text-xs text-slate-500">{store.region}</p>
      <DemoBadge variant="warning" className="mt-2">
        {store.gbpState}
      </DemoBadge>
    </button>
  );
}

function KanbanColumn({
  stage,
  stores,
  onSelect,
}: {
  stage: KanbanStage;
  stores: DemoStore[];
  onSelect: (store: DemoStore) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-w-[220px] flex-1 flex-col rounded-xl border border-slate-200 bg-slate-50/80",
        isOver && "ring-2 ring-[#1a5c3a]",
      )}
    >
      <div className="border-b border-slate-200 px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-800">
          {KANBAN_STAGE_LABELS[stage]}
        </h4>
        <p className="text-xs text-slate-500">{stores.length} cửa hàng</p>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {stores.slice(0, 8).map((store) => (
          <KanbanCard key={store.id} store={store} onSelect={onSelect} />
        ))}
        {stores.length > 8 && (
          <p className="text-center text-xs text-slate-400">+{stores.length - 8} thêm</p>
        )}
      </div>
    </div>
  );
}

export function VerificationKanban({
  onSelectStore,
}: {
  onSelectStore: (store: DemoStore) => void;
}) {
  const [items, setItems] = useState(DEMO_STORES.slice(0, 32));
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const byStage = (stage: KanbanStage) => items.filter((s) => s.kanbanStage === stage);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const newStage = over.id as KanbanStage;
    if (!STAGES.includes(newStage)) return;
    setItems((prev) =>
      prev.map((s) => (s.id === active.id ? { ...s, kanbanStage: newStage } : s)),
    );
  };

  const activeStore = activeId ? items.find((s) => s.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            stores={byStage(stage)}
            onSelect={onSelectStore}
          />
        ))}
      </div>
      <DragOverlay>
        {activeStore ? (
          <div className="rounded-lg border bg-white p-3 shadow-lg">
            <p className="text-sm font-medium">{activeStore.name}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
