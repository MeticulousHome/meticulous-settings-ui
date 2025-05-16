import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const BooleanField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="form-check mb-3">
    <input
      className="form-check-input"
      type="checkbox"
      id={label}
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
    <label className="form-check-label" htmlFor={label}>
      {label}
    </label>
  </div>
);

export const StringField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="mb-3">
    <label htmlFor={label} className="form-label">
      {label}
    </label>
    <input
      type="text"
      className="form-control"
      id={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export const NumberField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="mb-3">
    <label htmlFor={label} className="form-label">
      {label}
    </label>
    <input
      type="number"
      className="form-control"
      id={label}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </div>
);

export const ObjectEditor = ({
  obj_val,
  onChange,
  title,
}: {
  obj_val: any;
  onChange: (v: any) => void;
  title: string;
}) => (
  <fieldset className="mb-3 card p-3">
    <legend>{title}</legend>
    {Object.entries(obj_val).map(([key, value]) => {
      if (typeof value === "boolean") {
        return (
          <BooleanField
            key={key}
            label={key}
            value={value}
            onChange={(new_val) => onChange({ ...obj_val, [key]: new_val })}
          />
        );
      } else if (typeof value === "string") {
        return (
          <StringField
            key={key}
            label={key}
            value={value}
            onChange={(new_val) => onChange({ ...obj_val, [key]: new_val })}
          />
        );
      } else if (typeof value === "number") {
        return (
          <NumberField
            key={key}
            label={key}
            value={value}
            onChange={(new_val) => onChange({ ...obj_val, [key]: new_val })}
          />
        );
      } else {
        return null;
      }
    })}
  </fieldset>
);

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-group-item"
    >
      {id}
    </li>
  );
}

export type ListItemProp = {
  key: string;
  value: string;
};

const getItemKey = (item: ListItemProp) => {
  return `${item.value} (${item.key})`;
};

export const DragDropList = ({
  value: items,
  onChange,
  title,
}: {
  value: ListItemProp[];
  onChange: (v: ListItemProp[]) => void;
  title: string;
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      
      const oldIndex = items.findIndex(
        (item) => getItemKey(item) === active.id
      );
      const newIndex = items.findIndex((item) => getItemKey(item) === over.id);
      console.log("oldIndex", oldIndex);
      console.log("newIndex", newIndex);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      onChange(newOrder);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">{title}</label>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => `${item.value} (${item.key})`)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list-group">
            {items.map((id) => (
              <SortableItem key={getItemKey(id)} id={getItemKey(id)} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};
