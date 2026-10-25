export default function SelectField({
  label,
  value,
  onChange,
  options
}) {
  return (
    <label className="block">
      {label && (
        <span
          className="
            mb-2 block text-xs
            font-medium uppercase
            tracking-[0.14em]
            text-slate-500
          "
        >
          {label}
        </span>
      )}

      <select
        value={value}
        onChange={onChange}
        className="
          min-w-36 rounded-xl
          border border-white/10
          bg-slate-950
          px-3 py-2.5
          text-sm text-slate-200
          outline-none transition
          hover:border-white/20
          focus:border-cyan-400/50
          focus:ring-2
          focus:ring-cyan-400/10
        "
      >
        {options.map(
          ({
            value: optionValue,
            label: optionLabel
          }) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}
      </select>
    </label>
  );
}