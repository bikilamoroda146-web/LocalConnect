// Table on md+, labelled stacked rows on mobile so no data is hidden.
export default function DataTable({ columns, rows, rowKey = 'id', empty = 'Nothing to show.' }) {
  if (!rows.length) return <div className="card p-8 text-center text-ink-soft">{empty}</div>
  return (
    <>
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-ink-soft">
            <tr>{columns.map((c) => <th key={c.key} scope="col" className="px-4 py-3 font-semibold">{c.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r[rowKey]} className="hover:bg-slate-50/60">
                {columns.map((c) => <td key={c.key} className="px-4 py-3 align-middle">{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r[rowKey]} className="card divide-y divide-line">
            {columns.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
                <span className="text-ink-muted">{c.header}</span>
                <span className="text-right">{c.render ? c.render(r) : r[c.key]}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </>
  )
}
