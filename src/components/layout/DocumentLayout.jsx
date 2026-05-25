import { Link } from 'react-router-dom';

/**
 * DocumentLayout — reusable document-style page wrapper.
 * Used for surat preview, persetujuan, dan halaman dokumen lain.
 */
const DocumentLayout = ({
  badge,
  title,
  subtitle,
  headerActions,
  children,
  sidebar,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          {badge && (
            <div className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-red-600 mb-3">
              {badge}
            </div>
          )}
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {headerActions && (
          <div className="flex items-center justify-end gap-3">{headerActions}</div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.75fr_0.95fr]">
        <div className="rounded-[2rem] border border-gray-200 bg-white shadow-sm p-6">
          {children}
        </div>
        {sidebar && <div className="space-y-5">{sidebar}</div>}
      </div>
    </div>
  );
};

export default DocumentLayout;
