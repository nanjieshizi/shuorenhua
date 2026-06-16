interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label
      className="cursor-pointer"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, color: '#111111' }}>{label}</span>
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label}
        />
        <div
          aria-hidden="true"
          style={{
            width: 44,
            height: 24,
            borderRadius: 999,
            backgroundColor: checked ? '#111111' : '#E5E5EA',
            transition: 'background-color 200ms',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 2,
            top: 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 200ms',
          }}
        />
      </div>
    </label>
  )
}
