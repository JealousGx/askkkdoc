"use client";

interface EmptyState {
  title?: string;
  subtitle?: string;
}

export const EmptyState: React.FC<EmptyState> = ({ title, subtitle }) => {
  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <div className="text-center">
        <div className="text-2xl font-bold">{title}</div>
        {subtitle && (
          <div className="font-light mt-2 text-neutral-500">{subtitle}</div>
        )}
      </div>
    </div>
  );
};
