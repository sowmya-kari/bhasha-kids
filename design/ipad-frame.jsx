// Minimal iPad (landscape) bezel — no assets, no deps. window.IPadDevice
function IPadDevice({ children, width = 1194, height = 834, dark = false }) {
  const bezel = 16;
  return (
    <div data-om-starter="ipad-frame" style={{
      width: width + bezel * 2, height: height + bezel * 2, padding: bezel,
      boxSizing: 'border-box', borderRadius: 42, position: 'relative',
      background: dark ? '#1b1b1f' : '#2a2730',
      boxShadow: '0 40px 90px rgba(0,0,0,0.22), inset 0 0 0 1.5px rgba(255,255,255,0.09)',
      fontFamily: '-apple-system, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{
        position: 'absolute', left: bezel / 2 - 2, top: '50%', transform: 'translateY(-50%)',
        width: 5, height: 5, borderRadius: '50%', background: '#4b4756',
      }} />
      <div style={{
        width, height, borderRadius: 28, overflow: 'hidden', position: 'relative',
        background: dark ? '#000' : '#fff',
      }}>{children}</div>
      <div style={{
        position: 'absolute', left: '50%', bottom: 5, transform: 'translateX(-50%)',
        width: 150, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.45)',
      }} />
    </div>
  );
}

function IPadStatusBar({ time = '9:41', color = '#25334f' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 26px 2px', fontSize: 13, fontWeight: 600, color,
      fontFamily: '-apple-system, "SF Pro", system-ui', letterSpacing: -0.2,
    }}>
      <span>{time}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="18" height="11" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={color}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={color}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={color}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={color}/>
        </svg>
        <svg width="24" height="12" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={color} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="18" height="9" rx="2" fill={color}/>
        </svg>
      </span>
    </div>
  );
}

Object.assign(window, { IPadDevice, IPadStatusBar });
